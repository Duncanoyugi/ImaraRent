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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LeasesService } from './leases.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, LeaseStatus } from '@prisma/client';
import { CreateLeaseDto, UpdateLeaseDto } from './dto';

@ApiTags('Leases')
@Controller('leases')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new lease draft' })
  @ApiResponse({ status: 201, description: 'Lease created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Unit or tenant already has active lease',
  })
  async create(@Body() dto: CreateLeaseDto, @Request() req) {
    return this.leasesService.create(req.user.id, req.user.organizationId, dto);
  }

  @Post(':id/activate')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Activate a lease (Owner only)' })
  @ApiResponse({ status: 200, description: 'Lease activated successfully' })
  @ApiResponse({ status: 400, description: 'Lease already active' })
  @ApiResponse({ status: 404, description: 'Lease not found' })
  async activateLease(@Param('id') id: string, @Request() req) {
    return this.leasesService.activateLease(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all leases in organization' })
  @ApiQuery({ name: 'status', enum: LeaseStatus, required: false })
  @ApiQuery({ name: 'unitId', required: false })
  @ApiResponse({ status: 200, description: 'Leases retrieved successfully' })
  async findAll(
    @Query('status') status: LeaseStatus,
    @Query('unitId') unitId: string,
    @Request() req,
  ) {
    return this.leasesService.findAll(
      req.user.organizationId,
      req.user.id,
      status,
      unitId,
    );
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get lease by ID with full details' })
  @ApiResponse({ status: 200, description: 'Lease retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lease not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.leasesService.findOne(id, req.user.organizationId, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update lease (draft only)' })
  @ApiResponse({ status: 200, description: 'Lease updated successfully' })
  @ApiResponse({ status: 400, description: 'Cannot update active lease' })
  @ApiResponse({ status: 404, description: 'Lease not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLeaseDto,
    @Request() req,
  ) {
    return this.leasesService.update(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post(':id/terminate')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Terminate an active lease' })
  @ApiResponse({ status: 200, description: 'Lease terminated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Cannot terminate with outstanding balance',
  })
  @ApiResponse({ status: 404, description: 'Lease not found' })
  async terminateLease(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Request() req,
  ) {
    return this.leasesService.terminateLease(
      id,
      req.user.organizationId,
      req.user.id,
      body.reason,
    );
  }
}
