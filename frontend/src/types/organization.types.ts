import type { User } from './user.types';

export interface Organization {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  users?: User[];
  _count?: {
    properties: number;
    tenants: number;
    users: number;
  };
}

export interface UpdateOrganizationData {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface OrganizationStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  activeLeases: number;
  monthlyRevenue: number;
  outstandingBalance: number;
  occupancyRate: number;
}
