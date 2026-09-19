import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import { decimal } from '@/utils/number-helpers';
import { daysUntil } from '@/utils/date-formatter';
import { fullName } from '@/utils/string-helpers';
import type {
  ManagerDashboardData,
  ManagerTask,
  ManagerTicketSummary,
  ManagerVacantUnit,
  ManagerTenantCheckin,
} from '../types/manager-dashboardtypes';

/* The API returns Prisma records with nested relations; these describe only
   the fields this service reads, so a shape change fails at compile time. */
interface RawUnit {
  id: string;
  number: string;
  status: string;
  rentAmount: unknown;
  bedrooms: number | null;
  propertyId: string;
  property?: { id: string; name: string };
}

interface RawProperty {
  id: string;
  name: string;
  units?: RawUnit[];
}

interface RawTenant {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
  invitationAcceptedAt?: string | null;
  leases?: Array<{ unit?: { number: string; property?: { name: string } } }>;
}

interface RawInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  dueDate: string;
  balance: unknown;
  tenant?: { firstName: string; lastName: string };
  lease?: { unit?: { number: string; property?: { name: string } } };
}

interface RawTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  unit?: { number: string; property?: { name: string } };
  tenant?: { firstName: string; lastName: string };
}

const OPEN_TICKET_STATUSES = new Set(['OPEN', 'ASSIGNED', 'IN_PROGRESS']);
const UNPAID_INVOICE_STATUSES = new Set(['PENDING', 'PARTIALLY_PAID', 'OVERDUE']);

const URGENCY_ORDER: Record<ManagerTask['urgency'], number> = {
  urgent: 0,
  high: 1,
  normal: 2,
};

/**
 * There is no `/manager-dashboard` endpoint — a manager's view is assembled
 * from the same collection endpoints they already have access to. The API
 * scopes each of those to the properties assigned to them, so no extra
 * filtering is needed here.
 *
 * `allSettled` is deliberate: one failing collection should degrade a single
 * panel, not blank the whole dashboard.
 */
export const managerDashboardService = {
  getDashboard: async (): Promise<ManagerDashboardData> => {
    const [propertiesRes, unitsRes, tenantsRes, invoicesRes, ticketsRes] =
      await Promise.allSettled([
        api.get<RawProperty[]>(API_ROUTES.PROPERTIES.BASE),
        api.get<RawUnit[]>(API_ROUTES.UNITS.BASE),
        api.get<RawTenant[]>(API_ROUTES.TENANTS.BASE),
        api.get<RawInvoice[]>(API_ROUTES.BILLING.INVOICES),
        api.get<RawTicket[]>(API_ROUTES.MAINTENANCE.TICKETS),
      ]);

    const settled = <T,>(result: PromiseSettledResult<T[]>): T[] =>
      result.status === 'fulfilled' ? (result.value ?? []) : [];

    const properties = settled(propertiesRes);
    const units = settled(unitsRes);
    const tenants = settled(tenantsRes);
    const invoices = settled(invoicesRes);
    const tickets = settled(ticketsRes);

    const propertyName = (unit: RawUnit | undefined): string =>
      unit?.property?.name ??
      properties.find((p) => p.id === unit?.propertyId)?.name ??
      'Unassigned';

    // ---- stats -----------------------------------------------------------
    const occupiedUnits = units.filter((u) => u.status === 'OCCUPIED').length;
    const vacantUnitList = units.filter((u) => u.status === 'VACANT');
    const openTickets = tickets.filter((t) => OPEN_TICKET_STATUSES.has(t.status));
    const unpaidInvoices = invoices.filter((i) => UNPAID_INVOICE_STATUSES.has(i.status));
    const overdueInvoices = unpaidInvoices.filter((i) => (daysUntil(i.dueDate) ?? 0) < 0);

    const stats = {
      assignedProperties: properties.length,
      totalUnits: units.length,
      vacantUnits: vacantUnitList.length,
      occupiedUnits,
      occupancyRate: units.length > 0 ? Math.round((occupiedUnits / units.length) * 100) : 0,
      activeTenants: tenants.filter((t) => t.status === 'ACTIVE').length,
      openTickets: openTickets.length,
      urgentTickets: openTickets.filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH')
        .length,
      duePayments: unpaidInvoices.length,
      overdueAmount: overdueInvoices.reduce((total, i) => total + decimal(i.balance), 0),
    };

    // ---- task list -------------------------------------------------------
    const tasks: ManagerTask[] = [];

    openTickets
      .filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH')
      .forEach((ticket) =>
        tasks.push({
          id: `ticket-${ticket.id}`,
          kind: 'ticket',
          title: ticket.title,
          detail: `Unit ${ticket.unit?.number ?? '—'} · ${ticket.unit?.property?.name ?? '—'}`,
          urgency: ticket.priority === 'URGENT' ? 'urgent' : 'high',
          href: `/maintenance/${ticket.id}`,
        })
      );

    overdueInvoices.forEach((invoice) => {
      const overdueBy = Math.abs(daysUntil(invoice.dueDate) ?? 0);
      tasks.push({
        id: `invoice-${invoice.id}`,
        kind: 'invoice',
        title: `${invoice.invoiceNumber} is overdue`,
        detail: `${fullName(invoice.tenant?.firstName, invoice.tenant?.lastName)} · ${overdueBy} day${overdueBy === 1 ? '' : 's'} late`,
        urgency: overdueBy > 14 ? 'urgent' : 'high',
        href: `/billing/invoices/${invoice.id}`,
        dueDate: invoice.dueDate,
      });
    });

    if (vacantUnitList.length > 0) {
      tasks.push({
        id: 'vacancy-summary',
        kind: 'vacancy',
        title: `${vacantUnitList.length} unit${vacantUnitList.length === 1 ? '' : 's'} sitting empty`,
        detail: 'Assign a tenant or mark the unit as reserved.',
        urgency: 'normal',
        href: '/units',
      });
    }

    tasks.sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]);

    // ---- panels ----------------------------------------------------------
    const ticketSummaries: ManagerTicketSummary[] = openTickets
      .slice()
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 6)
      .map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        unitNumber: ticket.unit?.number ?? '—',
        propertyName: ticket.unit?.property?.name ?? '—',
        tenantName: fullName(ticket.tenant?.firstName, ticket.tenant?.lastName, 'Unknown tenant'),
        createdAt: ticket.createdAt,
      }));

    const vacantUnits: ManagerVacantUnit[] = vacantUnitList.slice(0, 6).map((unit) => ({
      id: unit.id,
      number: unit.number,
      propertyName: propertyName(unit),
      rentAmount: decimal(unit.rentAmount),
      bedrooms: unit.bedrooms,
      status: unit.status,
    }));

    const checkins: ManagerTenantCheckin[] = tenants
      .slice()
      .sort(
        (a, b) =>
          +new Date(b.invitationAcceptedAt ?? b.createdAt) -
          +new Date(a.invitationAcceptedAt ?? a.createdAt)
      )
      .slice(0, 5)
      .map((tenant) => {
        const lease = tenant.leases?.[0];
        return {
          id: tenant.id,
          tenantName: fullName(tenant.firstName, tenant.lastName),
          unitNumber: lease?.unit?.number ?? '—',
          propertyName: lease?.unit?.property?.name ?? '—',
          event:
            tenant.status === 'ACTIVE'
              ? tenant.invitationAcceptedAt
                ? 'Accepted their invitation'
                : 'Moved in'
              : tenant.status === 'PENDING'
                ? 'Invitation sent, not yet accepted'
                : `Marked ${tenant.status.toLowerCase()}`,
          at: tenant.invitationAcceptedAt ?? tenant.createdAt,
        };
      });

    return { stats, tasks, tickets: ticketSummaries, vacantUnits, checkins };
  },
};
