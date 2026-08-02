import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TenantPortalService } from './tenant-portal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateTenantProfileDto } from './dto';

@ApiTags('Tenant Portal')
@Controller('tenant-portal')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(UserRole.TENANT)
export class TenantPortalController {
  constructor(
    private readonly tenantPortalService: TenantPortalService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get tenant dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard retrieved successfully' })
  async getDashboard(@Request() req) {
    // Get tenant from user
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getDashboard(
      tenant.id,
      req.user.organizationId,
    );
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get tenant invoices' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  async getInvoices(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Request() req,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getInvoices(tenant.id, limit, offset);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getInvoice(@Param('id') id: string, @Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getInvoice(id, tenant.id);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get tenant payments' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async getPayments(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Request() req,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getPayments(tenant.id, limit, offset);
  }

  @Get('payments/:id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param('id') id: string, @Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getPayment(id, tenant.id);
  }

  @Get('lease')
  @ApiOperation({ summary: 'Get active lease' })
  @ApiResponse({ status: 200, description: 'Lease retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No active lease found' })
  async getLease(@Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getLease(tenant.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update tenant profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Body() dto: UpdateTenantProfileDto, @Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.updateProfile(tenant.id, dto);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get tenant balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getBalance(@Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getBalance(tenant.id);
  }

  @Get('maintenance')
  @ApiOperation({ summary: 'Get tenant maintenance tickets' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Maintenance tickets retrieved successfully',
  })
  async getMaintenanceTickets(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Request() req,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getMaintenanceTickets(
      tenant.id,
      limit,
      offset,
    );
  }

  @Get('maintenance/:id')
  @ApiOperation({ summary: 'Get maintenance ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async getMaintenanceTicket(@Param('id') id: string, @Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getMaintenanceTicket(id, tenant.id);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get tenant notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async getNotifications(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Request() req,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getNotifications(tenant.id, limit, offset);
  }

  @Post('notifications/:id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markNotificationRead(@Param('id') id: string, @Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.markNotificationRead(id, tenant.id);
  }

  @Get('notifications/unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Count retrieved successfully' })
  async getUnreadNotificationCount(@Request() req) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { userId: req.user.id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return this.tenantPortalService.getUnreadNotificationCount(tenant.id);
  }
}
