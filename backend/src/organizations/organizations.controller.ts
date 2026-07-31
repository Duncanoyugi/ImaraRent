import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateOrganizationDto } from './dto';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('me')
  @ApiOperation({ summary: "Get current user's organization with details" })
  @ApiResponse({ status: 200, description: 'Organization details retrieved' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getMyOrganization(@Request() req) {
    return this.organizationsService.findById(
      req.user.organizationId,
      req.user.id,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization details retrieved' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getOrganization(@Param('id') id: string, @Request() req) {
    return this.organizationsService.findById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization (Owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only owners can update organization',
  })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async updateOrganization(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, req.user.id, dto);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get all users in organization' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getOrganizationUsers(@Param('id') id: string, @Request() req) {
    return this.organizationsService.getUsers(id, req.user.id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get organization statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getOrganizationStats(@Param('id') id: string, @Request() req) {
    return this.organizationsService.getStats(id, req.user.id);
  }
}
