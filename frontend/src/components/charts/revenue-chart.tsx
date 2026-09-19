import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AXIS_PROPS, CHART_COLORS, ChartEmpty, ChartTooltip, currencyTick } from './chart-primitives';

export interface RevenuePoint {
  month: string;
  expected: number;
  collected: number;
}

export interface RevenueChartProps {
  data: RevenuePoint[] | undefined;
  height?: number;
}

/**
 * Expected vs collected rent, month by month. Paired bars rather than
 * stacked — the gap between them is the story.
 */
export const RevenueChart = ({ data, height = 300 }: RevenueChartProps) => {
  if (!data || data.length === 0) {
    return <ChartEmpty message="No revenue recorded yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="month" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} tickFormatter={currencyTick} width={56} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar
          dataKey="expected"
          name="Expected"
          fill={CHART_COLORS.brandLight}
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
        />
        <Bar
          dataKey="collected"
          name="Collected"
          fill={CHART_COLORS.brand}
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

RevenueChart.displayName = 'RevenueChart';
