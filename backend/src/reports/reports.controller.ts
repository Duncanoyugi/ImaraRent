import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ReportRequestDto } from './dto';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.OWNER, UserRole.MANAGER)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('income-statement')
  @ApiOperation({ summary: 'Generate income statement report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateIncomeStatement(@Body() dto: ReportRequestDto, @Request() req) {
    return this.reportsService.generateIncomeStatement(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('rent-roll')
  @ApiOperation({ summary: 'Generate rent roll report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateRentRoll(@Body() dto: ReportRequestDto, @Request() req) {
    return this.reportsService.generateRentRoll(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('arrears-aging')
  @ApiOperation({ summary: 'Generate arrears aging report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateArrearsAging(@Body() dto: ReportRequestDto, @Request() req) {
    return this.reportsService.generateArrearsAging(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('occupancy')
  @ApiOperation({ summary: 'Generate occupancy report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateOccupancyReport(@Body() dto: ReportRequestDto, @Request() req) {
    return this.reportsService.generateOccupancyReport(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('maintenance')
  @ApiOperation({ summary: 'Generate maintenance report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateMaintenanceReport(
    @Body() dto: ReportRequestDto,
    @Request() req,
  ) {
    return this.reportsService.generateMaintenanceReport(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Post('tenant-statement/:tenantId')
  @ApiOperation({ summary: 'Generate tenant statement' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateTenantStatement(
    @Param('tenantId') tenantId: string,
    @Request() req,
  ) {
    return this.reportsService.generateTenantStatement(
      req.user.organizationId,
      req.user.id,
      tenantId,
    );
  }
}
