export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string | null;
  dateOfBirth: string | null;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
  userId: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  unit?: {
    id: string;
    number: string;
    property: {
      id: string;
      name: string;
    };
  };
  user?: {
    id: string;
    isActive: boolean;
    lastLoginAt: string | null;
  };
  activeLease?: {
    id: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
    status: string;
  } | null;
  hasUserAccount?: boolean;
  invitationToken?: string | null;
  invitationLink?: string | null;
}

export interface CreateTenantData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId?: string;
  dateOfBirth?: string;
  unitId: string;
}

export interface UpdateTenantData extends Partial<CreateTenantData> {
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
}

export interface AcceptInvitationData {
  token: string;
  password: string;
}

export interface ResendInvitationData {
  tenantId: string;
}

export interface TenantFilters {
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
  unitId?: string;
  search?: string;
}