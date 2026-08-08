export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  cost: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  tenantId: string;
  unitId: string;
  createdById: string;
  assignedToId: string | null;
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
    };
  };
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  photos?: MaintenancePhoto[];
}

export interface MaintenancePhoto {
  id: string;
  fileUrl: string;
  uploadedAt: string;
  ticketId: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  unitId: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  assignedToId?: string;
  cost?: number;
  resolutionNotes?: string;
}

export interface TicketFilters {
  status?: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  unitId?: string;
  assignedToId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface TicketStats {
  total: number;
  open: number;
  assigned: number;
  inProgress: number;
  completed: number;
  byPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    URGENT: number;
  };
}