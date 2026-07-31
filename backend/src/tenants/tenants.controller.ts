import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, TenantStatus } from '@prisma/client';
import { CreateTenantDto, UpdateTenantDto, AcceptInvitationDto } from './dto';

@ApiTags('Tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new tenant and send invitation' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Email already exists or unit occupied',
  })
  async create(@Body() dto: CreateTenantDto, @Request() req) {
    return this.tenantsService.create(
      req.user.id,
      req.user.organizationId,
      dto,
    );
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all tenants in organization' })
  @ApiQuery({ name: 'status', enum: TenantStatus, required: false })
  @ApiResponse({ status: 200, description: 'Tenants retrieved successfully' })
  async findAll(@Query('status') status: TenantStatus, @Request() req) {
    return this.tenantsService.findAll(
      req.user.organizationId,
      req.user.id,
      status,
    );
  }

  @Get('unit/:unitId')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get tenant by unit ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No tenant found for this unit' })
  async getByUnit(@Param('unitId') unitId: string, @Request() req) {
    return this.tenantsService.getTenantByUnit(
      unitId,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get tenant by ID with full details' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tenantsService.findOne(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
    @Request() req,
  ) {
    return this.tenantsService.update(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('accept-invitation')
  @ApiOperation({ summary: 'Accept invitation and create user account' })
  @ApiResponse({ status: 201, description: 'Invitation accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired invitation' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async acceptInvitation(@Body() dto: AcceptInvitationDto) {
    return this.tenantsService.acceptInvitation(dto);
  }

  @Post(':id/resend-invitation')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Resend invitation to tenant' })
  @ApiResponse({ status: 200, description: 'Invitation resent successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cooldown period or invalid status',
  })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async resendInvitation(@Param('id') id: string, @Request() req) {
    return this.tenantsService.resendInvitation(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Post(':id/cancel-invitation')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cancel pending invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation cancelled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Only pending invitations can be cancelled',
  })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async cancelInvitation(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Request() req,
  ) {
    return this.tenantsService.cancelInvitation(
      id,
      req.user.organizationId,
      req.user.id,
      body.reason,
    );
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Delete tenant (soft delete, Owner only)' })
  @ApiResponse({ status: 200, description: 'Tenant deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Cannot delete tenant with active lease',
  })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async deleteTenant(@Param('id') id: string, @Request() req) {
    return this.tenantsService.deleteTenant(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }
}
