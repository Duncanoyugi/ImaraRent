/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { hash, verify } from 'argon2';
import {
  AssignManagerPropertiesDto,
  ChangePasswordDto,
  InviteManagerDto,
  UpdateUserDto,
} from './dto';
import { EmailService } from '../notifications/channels/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findById(id: string, requestingUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        tenantProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if requesting user is in the same organization
    const requestingUser = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (
      !requestingUser ||
      requestingUser.organizationId !== user.organizationId
    ) {
      throw new ForbiddenException('You do not have access to this user');
    }

    // Remove password hash
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async inviteManager(
    organizationId: string,
    requestingUserId: string,
    dto: InviteManagerDto,
  ) {
    // Verify requester is owner
    const requester = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requester || requester.role !== 'OWNER') {
      throw new ForbiddenException('Only owners can invite managers');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate a temporary password (user will reset on first login)
    const tempPassword = this.generateTempPassword();
    const passwordHash = await hash(tempPassword);

    const propertyIds = [...new Set(dto.propertyIds ?? [])];
    const properties = await this.prisma.property.findMany({
      where: { id: { in: propertyIds }, organizationId },
      select: { id: true },
    });

    if (properties.length !== propertyIds.length) {
      throw new ForbiddenException('All assigned properties must belong to your organization');
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          role: UserRole.MANAGER,
          organizationId,
          isActive: true,
        },
      });

      if (propertyIds.length > 0) {
        await tx.propertyManager.createMany({
          data: propertyIds.map((propertyId) => ({
            propertyId,
            managerId: createdUser.id,
            assignedBy: requestingUserId,
          })),
        });
      }

      return createdUser;
    });

    // Remove password hash from response
    const { passwordHash: _, ...safeUser } = user;

    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    const emailSent = await this.emailService.send({
      to: user.email,
      subject: 'You have been invited to manage properties on ImaraRent',
      text: [
        `Hello ${user.firstName},`,
        '',
        'You have been invited to ImaraRent as a property manager.',
        `Sign in: ${loginUrl}`,
        `Email: ${user.email}`,
        `Temporary password: ${tempPassword}`,
        '',
        'Please change this password after signing in.',
      ].join('\n'),
      html: `<p>Hello ${user.firstName},</p><p>You have been invited to ImaraRent as a property manager.</p><p><a href="${loginUrl}">Sign in to ImaraRent</a></p><p><strong>Email:</strong> ${user.email}<br /><strong>Temporary password:</strong> ${tempPassword}</p><p>Please change this password after signing in.</p>`,
    });

    return {
      ...safeUser,
      emailSent,
    };
  }

  async getManagerProperties(managerId: string, requestingUserId: string) {
    const requester = await this.requireOwner(requestingUserId);
    const manager = await this.prisma.user.findFirst({
      where: { id: managerId, organizationId: requester.organizationId, role: UserRole.MANAGER },
      select: { id: true },
    });
    if (!manager) throw new NotFoundException('Manager not found');

    return this.prisma.propertyManager.findMany({
      where: { managerId, property: { organizationId: requester.organizationId } },
      include: { property: { select: { id: true, name: true, address: true } } },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async assignManagerProperties(managerId: string, requestingUserId: string, dto: AssignManagerPropertiesDto) {
    const requester = await this.requireOwner(requestingUserId);
    const propertyIds = [...new Set(dto.propertyIds)];
    const [manager, properties] = await Promise.all([
      this.prisma.user.findFirst({
        where: { id: managerId, organizationId: requester.organizationId, role: UserRole.MANAGER },
        select: { id: true },
      }),
      this.prisma.property.findMany({
        where: { id: { in: propertyIds }, organizationId: requester.organizationId },
        select: { id: true },
      }),
    ]);
    if (!manager) throw new NotFoundException('Manager not found');
    if (properties.length !== propertyIds.length) {
      throw new ForbiddenException('All properties must belong to your organization');
    }

    await this.prisma.$transaction([
      this.prisma.propertyManager.updateMany({ where: { managerId }, data: { isActive: false } }),
      ...propertyIds.map((propertyId) => this.prisma.propertyManager.upsert({
        where: { propertyId_managerId: { propertyId, managerId } },
        create: { propertyId, managerId, assignedBy: requestingUserId },
        update: { isActive: true, assignedBy: requestingUserId },
      })),
    ]);
    return this.getManagerProperties(managerId, requestingUserId);
  }

  private async requireOwner(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can manage manager assignments');
    }
    return user;
  }

  async updateUser(id: string, requestingUserId: string, dto: UpdateUserDto) {
    // Check if user exists and is in same organization
    const user = await this.findById(id, requestingUserId);

    // Only owners can update other users, or users can update themselves (limited fields)
    const requester = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    // Users can only update themselves, owners can update anyone
    if (requester.id !== id && requester.role !== 'OWNER') {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Non-owners cannot change roles or isActive
    if (requester.role !== 'OWNER') {
      const { isActive, ...rest } = dto as any;
      // Only allow updating basic info
      const updateData = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      };
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
      const { passwordHash, ...safeUser } = updatedUser;
      return safeUser;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser;
  }

  async deactivateUser(id: string, requestingUserId: string) {
    // Verify requester is owner
    const requester = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requester || requester.role !== 'OWNER') {
      throw new ForbiddenException('Only owners can deactivate users');
    }

    // Can't deactivate yourself
    if (id === requestingUserId) {
      throw new ForbiddenException('You cannot deactivate yourself');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async reactivateUser(id: string, requestingUserId: string) {
    // Verify requester is owner
    const requester = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requester || requester.role !== 'OWNER') {
      throw new ForbiddenException('Only owners can reactivate users');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private generateTempPassword(): string {
    // Generate a secure temporary password
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  /**
   * Changes a user's own password.
   *
   * Only the account holder may do this — an owner resetting someone else's
   * password would bypass the invitation flow, so it is refused outright.
   */
  async changePassword(
    id: string,
    requestingUserId: string,
    dto: ChangePasswordDto,
  ) {
    if (id !== requestingUserId) {
      throw new ForbiddenException('You can only change your own password');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await verify(user.passwordHash, dto.currentPassword);

    if (!isValid) {
      throw new UnauthorizedException('Your current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'Choose a password different from your current one',
      );
    }

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: await hash(dto.newPassword) },
    });

    return { success: true, message: 'Password changed successfully' };
  }

}
