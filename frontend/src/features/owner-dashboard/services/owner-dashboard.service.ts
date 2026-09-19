import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import { decimal } from '@/utils/number-helpers';
import { daysUntil } from '@/utils/date-formatter';
import type {
  ArrearsBucketSummary,
  PropertyPerformance,
} from '../types/owner-dashboard.types';

interface RawProperty {
  id: string;
  name: string;
  city: string;
  units?: Array<{ status: string; rentAmount: unknown }>;
  stats?: {
    totalUnits: number;
    occupiedUnits: number;
    totalRent: number;
    occupancyRate: number;
  };
}

interface RawInvoice {
  id: string;
  status: string;
  dueDate: string;
  balance: unknown;
}

/** Aging buckets, in days overdue. */
const BUCKETS: Array<{ label: string; min: number; max: number }> = [
  { label: 'Current', min: -Infinity, max: 0 },
  { label: '1–30 days', min: 1, max: 30 },
  { label: '31–60 days', min: 31, max: 60 },
  { label: '61–90 days', min: 61, max: 90 },
  { label: 'Over 90 days', min: 91, max: Infinity },
];

const UNPAID = new Set(['PENDING', 'PARTIALLY_PAID', 'OVERDUE']);

/**
 * Owner-only views that sit alongside the shared dashboard aggregate:
 * arrears aging and per-property performance.
 */
export const ownerDashboardService = {
  getArrearsBuckets: async (): Promise<ArrearsBucketSummary[]> => {
    const invoices = await api.get<RawInvoice[]>(API_ROUTES.BILLING.INVOICES);

    const summary = BUCKETS.map((bucket) => ({
      bucket: bucket.label,
      amount: 0,
      invoiceCount: 0,
    }));

    (invoices ?? [])
      .filter((invoice) => UNPAID.has(invoice.status))
      .forEach((invoice) => {
        // `daysUntil` is negative once a due date has passed.
        const overdueBy = -(daysUntil(invoice.dueDate) ?? 0);
        const index = BUCKETS.findIndex(
          (bucket) => overdueBy >= bucket.min && overdueBy <= bucket.max
        );
        if (index === -1) return;
        summary[index].amount += decimal(invoice.balance);
        summary[index].invoiceCount += 1;
      });

    return summary;
  },

  getPropertyPerformance: async (): Promise<PropertyPerformance[]> => {
    const properties = await api.get<RawProperty[]>(API_ROUTES.PROPERTIES.BASE);

    return (properties ?? []).map((property) => {
      // The list endpoint already computes stats; fall back to the units
      // array for any record that predates that.
      const units = property.units ?? [];
      const totalUnits = property.stats?.totalUnits ?? units.length;
      const occupiedUnits =
        property.stats?.occupiedUnits ?? units.filter((u) => u.status === 'OCCUPIED').length;
      const monthlyRent =
        property.stats?.totalRent ??
        units.reduce((total, unit) => total + decimal(unit.rentAmount), 0);

      return {
        id: property.id,
        name: property.name,
        city: property.city,
        totalUnits,
        occupiedUnits,
        occupancyRate:
          property.stats?.occupancyRate ??
          (totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0),
        monthlyRent,
      };
    });
  },
};
