import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AXIS_PROPS, CHART_COLORS, ChartEmpty, ChartTooltip, currencyTick } from './chart-primitives';

export interface ArrearsBucket {
  bucket: string;
  amount: number;
}

export interface ArrearsChartProps {
  data: ArrearsBucket[] | undefined;
  height?: number;
}

/**
 * Outstanding balance by age. Colour escalates with the bucket, so the
 * shape of the debt reads before any of the numbers do.
 */
const BUCKET_COLORS = [
  CHART_COLORS.success,
  CHART_COLORS.warning,
  '#fb923c',
  CHART_COLORS.error,
  '#991b1b',
];

export const ArrearsChart = ({ data, height = 280 }: ArrearsChartProps) => {
  if (!data || data.length === 0 || data.every((bucket) => bucket.amount === 0)) {
    return <ChartEmpty message="No outstanding balances. Everything is paid up." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <XAxis dataKey="bucket" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} tickFormatter={currencyTick} width={56} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Bar dataKey="amount" name="Outstanding" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {data.map((_, index) => (
            <Cell key={index} fill={BUCKET_COLORS[Math.min(index, BUCKET_COLORS.length - 1)]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

ArrearsChart.displayName = 'ArrearsChart';
