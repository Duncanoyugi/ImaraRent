export interface TenantDashboardData {
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId: string | null;
  };
  unit: {
    id: string;
    number: string;
    rentAmount: number;
    property: {
      id: string;
      name: string;
      address: string;
      phone: string | null;
    };
  } | null;
  activeLease: {
    id: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
    status: string;
    depositAmount: number;
    depositPaid: boolean;
  } | null;
  balance: {
    totalBalance: number;
    totalDue: number;
    totalPaid: number;
    invoiceCount: number;
    overdueInvoices: number;
  };
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: string;
    dueDate: string;
  }[];
  recentPayments: {
    id: string;
    amount: number;
    paymentDate: string;
    method: string;
    status: string;
    reference: string;
  }[];
  openMaintenanceTickets: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
  notifications: {
    id: string;
    type: string;
    content: string;
    createdAt: string;
    read?: boolean;
  }[];
}

export interface TenantInvoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
  dueDate: string;
}

export interface TenantPayment {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: string;
  reference: string;
}

export interface TenantLease {
  id: string;
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  status: string;
  depositAmount: number;
  depositPaid: boolean;
}

export interface TenantMaintenanceTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export interface TenantNotification {
  id: string;
  type: string;
  content: string;
  createdAt: string;
  read?: boolean;
}