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
import { UnitsService } from './units.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateUnitDto, UpdateUnitDto, BulkCreateUnitsDto } from './dto';

@ApiTags('Units')
@Controller('units')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  @ApiResponse({ status: 409, description: 'Unit number already exists' })
  async create(@Body() dto: CreateUnitDto, @Request() req) {
    return this.unitsService.create(req.user.id, req.user.organizationId, dto);
  }

  @Post('bulk')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Bulk create units' })
  @ApiResponse({ status: 201, description: 'Units created successfully' })
  async bulkCreate(@Body() dto: BulkCreateUnitsDto, @Request() req) {
    return this.unitsService.bulkCreate(
      req.user.id,
      req.user.organizationId,
      dto.units,
    );
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all units in organization' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiResponse({ status: 200, description: 'Units retrieved successfully' })
  async findAll(@Query('propertyId') propertyId: string, @Request() req) {
    return this.unitsService.findAll(
      req.user.organizationId,
      req.user.id,
      propertyId,
    );
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get unit by ID with details' })
  @ApiResponse({ status: 200, description: 'Unit retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.unitsService.findOne(id, req.user.organizationId, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update unit' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUnitDto,
    @Request() req,
  ) {
    return this.unitsService.update(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Delete unit (Owner only)' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Cannot delete unit with active lease',
  })
  @ApiResponse({ status: 404, description: 'Unit not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.unitsService.remove(id, req.user.organizationId, req.user.id);
  }
}
