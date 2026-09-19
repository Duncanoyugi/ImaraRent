export interface ManagerStats {
  assignedProperties: number;
  totalUnits: number;
  vacantUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  activeTenants: number;
  openTickets: number;
  urgentTickets: number;
  duePayments: number;
  overdueAmount: number;
}

export interface ManagerTask {
  id: string;
  kind: 'ticket' | 'invoice' | 'lease' | 'vacancy';
  title: string;
  detail: string;
  /** Drives ordering — urgent work floats to the top of the list. */
  urgency: 'urgent' | 'high' | 'normal';
  href: string;
  dueDate?: string | null;
}

export interface ManagerTicketSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  unitNumber: string;
  propertyName: string;
  tenantName: string;
  createdAt: string;
}

export interface ManagerVacantUnit {
  id: string;
  number: string;
  propertyName: string;
  rentAmount: number;
  bedrooms: number | null;
  status: string;
}

export interface ManagerTenantCheckin {
  id: string;
  tenantName: string;
  unitNumber: string;
  propertyName: string;
  /** What happened — a move-in, an invitation accepted, a payment. */
  event: string;
  at: string;
}

export interface ManagerDashboardData {
  stats: ManagerStats;
  tasks: ManagerTask[];
  tickets: ManagerTicketSummary[];
  vacantUnits: ManagerVacantUnit[];
  checkins: ManagerTenantCheckin[];
}
