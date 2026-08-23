import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async getManagedPropertyIds(managerId: string): Promise<string[]> {
    const assignments = await this.propertyManager.findMany({
      where: { managerId, isActive: true },
      select: { propertyId: true },
    });
    return assignments.map((a) => a.propertyId);
  }

  async getAccessiblePropertyIds(
    userId: string,
    organizationId: string,
  ): Promise<string[] | undefined> {
    const user = await this.user.findUnique({
      where: { id: userId },
      select: { role: true, organizationId: true },
    });

    if (!user || user.organizationId !== organizationId) return [];
    if (user.role === 'OWNER') return undefined;
    return this.getManagedPropertyIds(userId);
  }
}
