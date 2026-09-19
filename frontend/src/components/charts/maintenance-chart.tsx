import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AXIS_PROPS, CHART_COLORS, ChartEmpty, ChartTooltip } from './chart-primitives';

export interface MaintenancePoint {
  month: string;
  raised: number;
  resolved: number;
}

export interface MaintenanceChartProps {
  data: MaintenancePoint[] | undefined;
  height?: number;
}

/**
 * Tickets raised against tickets resolved. Stacking would hide the thing
 * that matters — whether resolution is keeping pace with demand.
 */
export const MaintenanceChart = ({ data, height = 280 }: MaintenanceChartProps) => {
  if (!data || data.length === 0) {
    return <ChartEmpty message="No maintenance history yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="month" {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} allowDecimals={false} width={44} />
        <Tooltip content={<ChartTooltip currency={false} />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="raised" name="Raised" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="resolved" name="Resolved" fill={CHART_COLORS.brand} radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
};

MaintenanceChart.displayName = 'MaintenanceChart';
