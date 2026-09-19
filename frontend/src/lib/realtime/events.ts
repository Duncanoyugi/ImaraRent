/**
 * Socket contract shared with the backend gateway.
 *
 * Kept as plain string constants so both ends can be grepped for an event
 * name, and so adding a listener never depends on a literal typo.
 */

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  PAYMENT_RECEIVED: 'payment:received',
  PAYMENT_FAILED: 'payment:failed',

  INVOICE_CREATED: 'invoice:created',
  INVOICE_UPDATED: 'invoice:updated',

  MAINTENANCE_CREATED: 'maintenance:created',
  MAINTENANCE_UPDATED: 'maintenance:updated',

  LEASE_UPDATED: 'lease:updated',
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export interface NotificationEvent {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: string;
}

export interface PaymentEvent {
  paymentId: string;
  tenantId: string;
  amount: number;
  method: string;
  status: string;
  reference?: string;
}

export interface InvoiceEvent {
  invoiceId: string;
  tenantId: string;
  invoiceNumber: string;
  status: string;
  balance: number;
}

export interface MaintenanceEvent {
  ticketId: string;
  unitId: string;
  status: string;
  priority: string;
  title: string;
}

export interface SocketEventMap {
  [SOCKET_EVENTS.NOTIFICATION_NEW]: NotificationEvent;
  [SOCKET_EVENTS.NOTIFICATION_READ]: { id: string };
  [SOCKET_EVENTS.PAYMENT_RECEIVED]: PaymentEvent;
  [SOCKET_EVENTS.PAYMENT_FAILED]: PaymentEvent;
  [SOCKET_EVENTS.INVOICE_CREATED]: InvoiceEvent;
  [SOCKET_EVENTS.INVOICE_UPDATED]: InvoiceEvent;
  [SOCKET_EVENTS.MAINTENANCE_CREATED]: MaintenanceEvent;
  [SOCKET_EVENTS.MAINTENANCE_UPDATED]: MaintenanceEvent;
}
