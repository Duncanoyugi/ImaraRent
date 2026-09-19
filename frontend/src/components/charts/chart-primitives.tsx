import { money, moneyCompact } from '@/utils/currency-formatter';

/**
 * Shared chart chrome.
 *
 * Recharts is themed with literal colours, so the palette is mirrored here
 * from the Tailwind tokens rather than read from CSS variables, which
 * Recharts' SVG attributes cannot resolve.
 */
export const CHART_COLORS = {
  brand: '#059669',
  brandLight: '#6ee7b7',
  info: '#3b82f6',
  warning: '#f59e0b',
  error: '#ef4444',
  success: '#22c55e',
  neutral: '#94a3b8',
  grid: '#e2e8f0',
} as const;

export const AXIS_PROPS = {
  stroke: CHART_COLORS.neutral,
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  /** Set false for counts (units, tickets) rather than money. */
  currency?: boolean;
  /** Appended to plain numeric values, e.g. `%`. */
  suffix?: string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  currency = true,
  suffix = '',
}: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      {label !== undefined && (
        <p className="mb-1.5 font-medium text-neutral-900 dark:text-neutral-100">{label}</p>
      )}
      <ul className="space-y-1">
        {payload.map((entry, index) => (
          <li key={index} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-neutral-500 dark:text-neutral-400">{entry.name}</span>
            <span className="ml-auto font-medium tabular text-neutral-900 dark:text-neutral-100">
              {currency ? money(entry.value) : `${entry.value}${suffix}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Compact axis labels so long KES figures do not crowd the plot. */
export const currencyTick = (value: number) => moneyCompact(value).replace('KSh', '').trim();

export const ChartEmpty = ({ message }: { message: string }) => (
  <div className="flex h-full min-h-48 items-center justify-center">
    <p className="text-sm text-neutral-400">{message}</p>
  </div>
);
