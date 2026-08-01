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
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, MaintenanceStatus } from '@prisma/client';
import { CreateTicketDto, UpdateTicketDto, AddPhotoDto } from './dto';

@ApiTags('Maintenance')
@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('tickets')
  @ApiOperation({ summary: 'Create a maintenance ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  async createTicket(@Body() dto: CreateTicketDto, @Request() req) {
    // Get tenant ID from user if tenant, or from request body for manager/owner
    let tenantId: string;

    if (req.user.role === UserRole.TENANT) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { userId: req.user.id },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant profile not found');
      }
      tenantId = tenant.id;
    } else {
      // For managers/owners, they need to specify which tenant
      // We'll use the first tenant on the unit, or require tenantId in body
      // For now, we'll throw an error
      throw new BadRequestException(
        'For managers/owners, please specify tenantId in the request',
      );
    }

    return this.maintenanceService.createTicket(
      tenantId,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Get('tickets')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all maintenance tickets' })
  @ApiQuery({ name: 'status', enum: MaintenanceStatus, required: false })
  @ApiQuery({ name: 'unitId', required: false })
  @ApiQuery({ name: 'assignedToId', required: false })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  async findAll(
    @Query('status') status: MaintenanceStatus,
    @Query('unitId') unitId: string,
    @Query('assignedToId') assignedToId: string,
    @Request() req,
  ) {
    return this.maintenanceService.findAll(
      req.user.organizationId,
      req.user.id,
      status,
      unitId,
      assignedToId,
    );
  }

  @Get('tickets/my')
  @ApiOperation({ summary: 'Get my tickets (tenant or assigned to me)' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  async getMyTickets(@Request() req) {
    return this.maintenanceService.getMyTickets(
      req.user.id,
      req.user.organizationId,
    );
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.maintenanceService.findOne(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Patch('tickets/:id')
  @ApiOperation({ summary: 'Update ticket' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async updateTicket(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @Request() req,
  ) {
    return this.maintenanceService.update(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('tickets/:id/assign')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Assign ticket to a manager/owner' })
  @ApiResponse({ status: 200, description: 'Ticket assigned successfully' })
  async assignTicket(
    @Param('id') id: string,
    @Body() body: { assignedToId: string },
    @Request() req,
  ) {
    return this.maintenanceService.assignTicket(
      id,
      req.user.organizationId,
      req.user.id,
      body.assignedToId,
    );
  }

  @Post('tickets/:id/complete')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Mark ticket as completed' })
  @ApiResponse({ status: 200, description: 'Ticket completed successfully' })
  async completeTicket(
    @Param('id') id: string,
    @Body() body: { resolutionNotes?: string },
    @Request() req,
  ) {
    return this.maintenanceService.completeTicket(
      id,
      req.user.organizationId,
      req.user.id,
      body.resolutionNotes,
    );
  }

  @Post('tickets/:id/photos')
  @ApiOperation({ summary: 'Add photo to ticket' })
  @ApiResponse({ status: 201, description: 'Photo added successfully' })
  async addPhoto(
    @Param('id') id: string,
    @Body() dto: AddPhotoDto,
    @Request() req,
  ) {
    return this.maintenanceService.addPhoto(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Get('stats')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get maintenance statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getStats(@Request() req) {
    return this.maintenanceService.getTicketStats(
      req.user.organizationId,
      req.user.id,
    );
  }
}
