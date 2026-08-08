export interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  method: 'MPESA' | 'CASH' | 'BANK_TRANSFER' | 'CARD';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  reference: string | null;
  mpesaTransactionId: string | null;
  bankReference: string | null;
  createdAt: string;
  tenantId: string;
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  allocations?: PaymentAllocation[];
}

export interface PaymentAllocation {
  id: string;
  amount: number;
  allocatedAt: string;
  paymentId: string;
  invoiceId: string;
  invoice?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    dueDate: string;
  };
}

export interface InitiateMpesaPaymentData {
  invoiceId: string;
  amount: number;
  phoneNumber: string;
}

export interface InitiateMpesaResponse {
  paymentId: string;
  checkoutRequestId: string;
  merchantRequestId: string;
  status: 'PENDING';
  message: string;
}

export interface ManualPaymentData {
  tenantId: string;
  amount: number;
  method: 'CASH' | 'BANK_TRANSFER' | 'CARD';
  reference?: string | null;
  notes?: string | null;
}

export interface PaymentFilters {
  tenantId?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  method?: 'MPESA' | 'CASH' | 'BANK_TRANSFER' | 'CARD';
  startDate?: string;
  endDate?: string;
}