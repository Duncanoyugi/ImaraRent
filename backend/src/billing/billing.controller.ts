import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, InvoiceStatus } from '@prisma/client';
import {
  CreateInvoiceDto,
  GenerateInvoicesDto,
  UpdateInvoiceDto,
  AddInvoiceLineDto,
} from './dto';

@ApiTags('Billing')
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('invoices/generate')
  @Roles(UserRole.OWNER)
  @ApiOperation({
    summary: 'Generate invoices for all active leases (Owner only)',
  })
  @ApiResponse({ status: 201, description: 'Invoices generated successfully' })
  async generateInvoices(@Body() dto: GenerateInvoicesDto, @Request() req) {
    return this.billingService.generateInvoices(req.user.organizationId, dto);
  }

  @Post('invoices/manual')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create manual invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  async createManualInvoice(@Body() dto: CreateInvoiceDto, @Request() req) {
    return this.billingService.createManualInvoice(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('invoices/:id/lines')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Add line to invoice' })
  @ApiResponse({ status: 201, description: 'Line added successfully' })
  async addInvoiceLine(
    @Param('id') id: string,
    @Body() dto: AddInvoiceLineDto,
    @Request() req,
  ) {
    return this.billingService.addInvoiceLine(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Get('invoices')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'status', enum: InvoiceStatus, required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  async findAll(
    @Query('status') status: InvoiceStatus,
    @Query('tenantId') tenantId: string,
    @Request() req,
  ) {
    return this.billingService.findAll(
      req.user.organizationId,
      req.user.id,
      status,
      tenantId,
    );
  }

  @Get('invoices/:id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.billingService.findOne(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get('tenants/:tenantId/invoices')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all invoices for a tenant' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
  async getTenantInvoices(@Param('tenantId') tenantId: string, @Request() req) {
    return this.billingService.getTenantInvoices(
      tenantId,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get('tenants/:tenantId/balance')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get tenant balance summary' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getTenantBalance(@Param('tenantId') tenantId: string, @Request() req) {
    return this.billingService.getTenantBalance(
      tenantId,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Patch('invoices/:id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot update paid or cancelled invoice',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async updateInvoice(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @Request() req,
  ) {
    return this.billingService.update(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('invoices/:id/void')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Void invoice (Owner only)' })
  @ApiResponse({ status: 200, description: 'Invoice voided successfully' })
  @ApiResponse({ status: 400, description: 'Cannot void paid invoice' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async voidInvoice(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Request() req,
  ) {
    return this.billingService.voidInvoice(
      id,
      req.user.organizationId,
      req.user.id,
      body.reason,
    );
  }
}
