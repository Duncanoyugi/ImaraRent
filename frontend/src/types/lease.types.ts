export interface Lease {
  id: string;
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  depositAmount: number | null;
  depositPaid: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  isActive: boolean;
  leaseDocumentUrl: string | null;
  terminatedAt: string | null;
  terminationReason: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  unitId: string;
  createdById: string;
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  unit?: {
    id: string;
    number: string;
    property: {
      id: string;
      name: string;
      address: string;
    };
  };
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  invoices?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    dueDate: string;
  }[];
}

export interface CreateLeaseData {
  startDate: string;
  endDate?: string | null;
  rentAmount: number;
  depositAmount?: number | null;
  tenantId: string;
  unitId: string;
}

export interface UpdateLeaseData {
  startDate?: string;
  endDate?: string;
  rentAmount?: number;
  depositAmount?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  isActive?: boolean;
  terminatedAt?: string;
  terminationReason?: string;
}

export interface LeaseFilters {
  status?: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  unitId?: string;
  isActive?: boolean;
}