import {
  Controller,
  Get,
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
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { SendNotificationDto } from './dto';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Send a notification (Owner/Manager only)' })
  @ApiResponse({ status: 201, description: 'Notification queued successfully' })
  async send(@Body() dto: SendNotificationDto, _req: Request) {
    return this.notificationsService.send(dto);
  }

  @Post('send/bulk')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Send bulk notifications' })
  @ApiResponse({
    status: 201,
    description: 'Notifications queued successfully',
  })
  async sendBulk(@Body() notifications: SendNotificationDto[], _req: Request) {
    return this.notificationsService.sendBulk(notifications);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get notification status' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  async getStatus(@Param('id') id: string) {
    return this.notificationsService.getStatus(id);
  }

  @Get('tenant/:tenantId')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get notifications for a tenant' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async getByTenant(@Param('tenantId') tenantId: string) {
    return this.notificationsService.getByTenant(tenantId);
  }

  @Get('user/me')
  @ApiOperation({ summary: "Get current user's notifications" })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  async getMyNotifications(@Request() req) {
    return this.notificationsService.getByUser(req.user.id);
  }

  @Post(':id/retry')
  @Roles(UserRole.OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Retry a failed notification' })
  @ApiResponse({ status: 200, description: 'Retry queued successfully' })
  async retryFailed(@Param('id') id: string) {
    return this.notificationsService.retryFailed(id);
  }
}
