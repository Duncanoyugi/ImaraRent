export interface Property {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  county: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  organizationId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  units?: UnitSummary[];
  stats?: PropertyStats;
}

export interface UnitSummary {
  id: string;
  number: string;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  rentAmount: number;
}

export interface PropertyStats {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  maintenanceUnits: number;
  totalRent: number;
  occupancyRate: number;
}

export interface CreatePropertyData {
  name: string;
  description?: string;
  address: string;
  city: string;
  county: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {}

export interface PropertyFilters {
  search?: string;
  city?: string;
  county?: string;
  status?: 'active' | 'inactive';
}