import {
  Controller,
  Get,
  Post,
  Patch,
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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { InviteManagerDto, UpdateUserDto } from './dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getMyProfile(@Request() req) {
    return this.usersService.findById(req.user.id, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string, @Request() req) {
    return this.usersService.findById(id, req.user.id);
  }

  @Post('invite-manager')
  @Roles(UserRole.OWNER)
  @ApiOperation({
    summary: 'Invite a manager to the organization (Owner only)',
  })
  @ApiResponse({ status: 201, description: 'Manager invited successfully' })
  @ApiResponse({ status: 403, description: 'Only owners can invite managers' })
  async inviteManager(@Body() dto: InviteManagerDto, @Request() req) {
    return this.usersService.inviteManager(
      req.user.organizationId,
      req.user.id,
      dto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.updateUser(id, req.user.id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Deactivate user (Owner only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  async deactivateUser(@Param('id') id: string, @Request() req) {
    return this.usersService.deactivateUser(id, req.user.id);
  }

  @Patch(':id/reactivate')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Reactivate user (Owner only)' })
  @ApiResponse({ status: 200, description: 'User reactivated successfully' })
  async reactivateUser(@Param('id') id: string, @Request() req) {
    return this.usersService.reactivateUser(id, req.user.id);
  }
}
