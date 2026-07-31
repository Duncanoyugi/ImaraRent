import {
  Controller,
  Get,
  Post,
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
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { InitiateMpesaPaymentDto, ManualPaymentDto } from './dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mpesa/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate M-Pesa STK Push payment' })
  @ApiResponse({ status: 201, description: 'Payment initiated successfully' })
  @ApiResponse({ status: 400, description: 'Payment initiation failed' })
  async initiateMpesaPayment(
    @Body() dto: InitiateMpesaPaymentDto,
    @Request() req,
  ) {
    return this.paymentsService.initiateMpesaPayment(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('mpesa/callback')
  @ApiOperation({ summary: 'M-Pesa Daraja callback endpoint' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  async handleMpesaCallback(@Body() callbackData: any) {
    return this.paymentsService.handleMpesaCallback(callbackData);
  }

  @Post('manual')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record manual payment (cash/bank transfer)' })
  @ApiResponse({ status: 201, description: 'Payment recorded successfully' })
  async recordManualPayment(@Body() dto: ManualPaymentDto, @Request() req) {
    return this.paymentsService.recordManualPayment(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async findAll(@Query('tenantId') tenantId: string, @Request() req) {
    return this.paymentsService.findAll(
      req.user.organizationId,
      req.user.id,
      tenantId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.paymentsService.findOne(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get('tenant/:tenantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments for a tenant' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async getTenantPayments(@Param('tenantId') tenantId: string, @Request() req) {
    return this.paymentsService.getTenantPayments(
      tenantId,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get('mpesa/status/:checkoutRequestId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Query M-Pesa payment status' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  async queryPaymentStatus(
    @Param('checkoutRequestId') checkoutRequestId: string,
    @Request() req,
  ) {
    return this.paymentsService.queryPaymentStatus(
      req.user.organizationId,
      req.user.id,
      checkoutRequestId,
    );
  }
}
