export interface Unit {
  id: string;
  number: string;
  floor: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  rentAmount: number;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    name: string;
    address: string;
  };
  currentTenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  hasActiveLease?: boolean;
}

export interface CreateUnitData {
  number: string;
  floor?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  rentAmount: number;
  status?: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  propertyId: string;
}

export interface UpdateUnitData extends Partial<CreateUnitData> {}

export interface BulkCreateUnitData {
  units: CreateUnitData[];
}

export interface UnitFilters {
  propertyId?: string;
  status?: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  search?: string;
}