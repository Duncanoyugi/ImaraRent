export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  description: string | null;
  createdAt: string;
  tenantId: string;
  leaseId: string;
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  lease?: {
    id: string;
    startDate: string;
    endDate: string | null;
    rentAmount: number;
    unit: {
      id: string;
      number: string;
      property: {
        id: string;
        name: string;
        address: string;
      };
    };
  };
  lines?: InvoiceLine[];
  allocations?: PaymentAllocation[];
}

export interface InvoiceLine {
  id: string;
  description: string;
  amount: number;
  type: 'RENT' | 'UTILITY' | 'LATE_FEE' | 'DISCOUNT' | 'CREDIT_NOTE';
  createdAt: string;
  invoiceId: string;
}

export interface PaymentAllocation {
  id: string;
  amount: number;
  allocatedAt: string;
  paymentId: string;
  invoiceId: string;
  payment?: {
    id: string;
    amount: number;
    paymentDate: string;
    method: string;
    reference: string;
    mpesaTransactionId: string | null;
    status: string;
  };
}

export interface CreateInvoiceData {
  dueDate: string;
  totalAmount: number;
  description?: string;
  leaseId: string;
}

export interface GenerateInvoicesData {
  periodStart: string;
  periodEnd: string;
  dueDate?: string;
}

export interface InvoiceFilters {
  status?: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  tenantId?: string;
  startDate?: string;
  endDate?: string;
}