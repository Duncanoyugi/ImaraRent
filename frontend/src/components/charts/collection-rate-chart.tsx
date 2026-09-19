import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AXIS_PROPS, CHART_COLORS, ChartEmpty, ChartTooltip } from './chart-primitives';

export interface CollectionPoint {
  month: string;
  rate: number;
}

export interface CollectionRateChartProps {
  data: CollectionPoint[] | undefined;
  /** Drawn as a dashed line so months can be read against the goal. */
  target?: number;
  height?: number;
}

/** Percentage of billed rent actually collected, over time. */
export const CollectionRateChart = ({
  data,
  target = 95,
  height = 260,
}: CollectionRateChartProps) => {
  if (!data || data.length === 0) {
    return <ChartEmpty message="Not enough billing history yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="collectionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.brand} stopOpacity={0.28} />
            <stop offset="100%" stopColor={CHART_COLORS.brand} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="month" {...AXIS_PROPS} />
        <YAxis
          {...AXIS_PROPS}
          domain={[0, 100]}
          tickFormatter={(value: number) => `${value}%`}
          width={48}
        />
        <Tooltip content={<ChartTooltip currency={false} suffix="%" />} />

        <ReferenceLine
          y={target}
          stroke={CHART_COLORS.neutral}
          strokeDasharray="4 4"
          label={{ value: `Target ${target}%`, position: 'right', fontSize: 11, fill: CHART_COLORS.neutral }}
        />

        <Area
          type="monotone"
          dataKey="rate"
          name="Collected"
          stroke={CHART_COLORS.brand}
          strokeWidth={2}
          fill="url(#collectionFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

CollectionRateChart.displayName = 'CollectionRateChart';
