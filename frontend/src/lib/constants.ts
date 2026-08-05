// App constants
export const APP_NAME = 'ImaraRent';
export const APP_DESCRIPTION = 'Property Management System';

// API routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  ORGANIZATIONS: {
    BASE: '/organizations',
    ME: '/organizations/me',
    USERS: '/organizations/:id/users',
    STATS: '/organizations/:id/stats',
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    INVITE_MANAGER: '/users/invite-manager',
    DEACTIVATE: '/users/:id/deactivate',
    REACTIVATE: '/users/:id/reactivate',
  },
  PROPERTIES: {
    BASE: '/properties',
    STATS: '/properties/stats',
  },
  UNITS: {
    BASE: '/units',
    BULK: '/units/bulk',
  },
  TENANTS: {
    BASE: '/tenants',
    ACCEPT_INVITATION: '/tenants/accept-invitation',
    RESEND_INVITATION: '/tenants/:id/resend-invitation',
    CANCEL_INVITATION: '/tenants/:id/cancel-invitation',
    UNIT: '/tenants/unit/:unitId',
  },
  LEASES: {
    BASE: '/leases',
    ACTIVATE: '/leases/:id/activate',
    TERMINATE: '/leases/:id/terminate',
  },
  BILLING: {
    BASE: '/billing',
    INVOICES: '/billing/invoices',
    GENERATE: '/billing/invoices/generate',
    LINES: '/billing/invoices/:id/lines',
    VOID: '/billing/invoices/:id/void',
    TENANT_INVOICES: '/billing/tenants/:tenantId/invoices',
    TENANT_BALANCE: '/billing/tenants/:tenantId/balance',
  },
  PAYMENTS: {
    BASE: '/payments',
    MPESA_INITIATE: '/payments/mpesa/initiate',
    MPESA_CALLBACK: '/payments/mpesa/callback',
    MPESA_STATUS: '/payments/mpesa/status/:checkoutRequestId',
    MANUAL: '/payments/manual',
    TENANT: '/payments/tenant/:tenantId',
  },
  MAINTENANCE: {
    BASE: '/maintenance/tickets',
    TICKETS: '/maintenance/tickets',
    MY_TICKETS: '/maintenance/tickets/my',
    ASSIGN: '/maintenance/tickets/:id/assign',
    COMPLETE: '/maintenance/tickets/:id/complete',
    PHOTOS: '/maintenance/tickets/:id/photos',
    STATS: '/maintenance/stats',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    SEND: '/notifications/send',
    BULK: '/notifications/send/bulk',
    STATUS: '/notifications/:id/status',
    TENANT: '/notifications/tenant/:tenantId',
    MY: '/notifications/user/me',
    RETRY: '/notifications/:id/retry',
  },
  TENANT_PORTAL: {
    BASE: '/tenant-portal',
    DASHBOARD: '/tenant-portal/dashboard',
    INVOICES: '/tenant-portal/invoices',
    PAYMENTS: '/tenant-portal/payments',
    LEASE: '/tenant-portal/lease',
    PROFILE: '/tenant-portal/profile',
    BALANCE: '/tenant-portal/balance',
    MAINTENANCE: '/tenant-portal/maintenance',
    NOTIFICATIONS: '/tenant-portal/notifications',
  },
  REPORTS: {
    BASE: '/reports',
    INCOME_STATEMENT: '/reports/income-statement',
    RENT_ROLL: '/reports/rent-roll',
    ARREARS_AGING: '/reports/arrears-aging',
    OCCUPANCY: '/reports/occupancy',
    MAINTENANCE: '/reports/maintenance',
    TENANT_STATEMENT: '/reports/tenant-statement/:tenantId',
  },
  HEALTH: {
    BASE: '/health',
    READINESS: '/health/readiness',
    LIVENESS: '/health/liveness',
  },
  METRICS: {
    BASE: '/metrics',
  },
};

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  ORGANIZATION: 'organization',
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_VISITED: 'lastVisited',
};

// User roles
export const USER_ROLES = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  TENANT: 'TENANT',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Status constants
export const STATUS_COLORS = {
  ACTIVE: 'bg-success-500',
  INACTIVE: 'bg-neutral-400',
  PENDING: 'bg-warning-500',
  COMPLETED: 'bg-success-500',
  FAILED: 'bg-error-500',
  CANCELLED: 'bg-neutral-400',
  EXPIRED: 'bg-neutral-400',
  OVERDUE: 'bg-error-500',
  PAID: 'bg-success-500',
  PARTIALLY_PAID: 'bg-warning-500',
  OPEN: 'bg-info-500',
  ASSIGNED: 'bg-warning-500',
  IN_PROGRESS: 'bg-info-500',
  CLOSED: 'bg-neutral-400',
  DRAFT: 'bg-neutral-400',
  TERMINATED: 'bg-error-500',
  VACANT: 'bg-neutral-400',
  OCCUPIED: 'bg-success-500',
  MAINTENANCE: 'bg-warning-500',
  RESERVED: 'bg-info-500',
  URGENT: 'bg-error-500',
  HIGH: 'bg-warning-500',
  MEDIUM: 'bg-info-500',
  LOW: 'bg-success-500',
} as const;

// Status labels
export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
  OVERDUE: 'Overdue',
  PAID: 'Paid',
  PARTIALLY_PAID: 'Partially Paid',
  OPEN: 'Open',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  CLOSED: 'Closed',
  DRAFT: 'Draft',
  TERMINATED: 'Terminated',
  VACANT: 'Vacant',
  OCCUPIED: 'Occupied',
  MAINTENANCE: 'Maintenance',
  RESERVED: 'Reserved',
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_FULL: 'EEEE, MMMM dd, yyyy',
  DISPLAY_TIME: 'h:mm a',
  DISPLAY_DATE_TIME: 'MMM dd, yyyy h:mm a',
  API: 'yyyy-MM-dd',
  API_FULL: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
};

// M-Pesa constants
export const MPESA = {
  ENVIRONMENTS: {
    SANDBOX: 'sandbox',
    PRODUCTION: 'production',
  },
  STATUS: {
    SUCCESS: 0,
    FAILED: 1,
  },
};

// Regular expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_KENYA: /^[0-9]{10,12}$/,
  NATIONAL_ID: /^[0-9]{8}$/,
  PASSWORD: /^.{8,}$/,
  URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
};