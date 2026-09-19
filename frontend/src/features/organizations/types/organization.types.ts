export type {
  Organization,
  UpdateOrganizationData,
  OrganizationStats,
} from '@/types/organization.types';

import type { User } from '@/types/user.types';

/** A user row as returned by `GET /organizations/me/users`. */
export interface OrganizationUser extends User {
  managedProperties?: Array<{
    property: { id: string; name: string };
  }>;
}

/** What `GET /organizations/:id/stats` actually returns. */
export interface OrganizationCounts {
  totalUsers: number;
  totalProperties: number;
  totalTenants: number;
  totalUnits: number;
}
