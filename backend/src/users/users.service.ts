/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { hash } from 'argon2';
import { InviteManagerDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

    // Create user with MANAGER role
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: UserRole.MANAGER,
        organizationId: organizationId,
        isActive: true,
      },
    });

    // Remove password hash from response
    const { passwordHash: _, ...safeUser } = user;

    // TODO: Send welcome email with temporary password
    // We'll implement this in the notifications module later

    return {
      ...safeUser,
      tempPassword, // Include temporary password in response (in production, send via email)
    };
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
}
