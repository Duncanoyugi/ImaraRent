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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async create(@Body() dto: CreatePropertyDto, @Request() req) {
    return this.propertiesService.create(
      req.user.id,
      req.user.organizationId,
      dto,
    );
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all properties in organization' })
  @ApiResponse({
    status: 200,
    description: 'Properties retrieved successfully',
  })
  async findAll(@Request() req) {
    return this.propertiesService.findAll(req.user.organizationId, req.user.id);
  }

  @Get('stats')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get property statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getStats(@Request() req) {
    return this.propertiesService.getStats(
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get property by ID with units' })
  @ApiResponse({ status: 200, description: 'Property retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.propertiesService.findOne(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update property' })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
    @Request() req,
  ) {
    return this.propertiesService.update(
      id,
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Delete property (Owner only)' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only owners can delete properties',
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.propertiesService.remove(
      id,
      req.user.organizationId,
      req.user.id,
    );
  }
}
