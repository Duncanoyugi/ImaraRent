import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, ChartEmpty, ChartTooltip } from './chart-primitives';

export interface OccupancyChartProps {
  occupied: number;
  vacant: number;
  maintenance?: number;
  reserved?: number;
  height?: number;
}

/**
 * Unit status breakdown. A donut, so the occupancy percentage can sit in the
 * middle — the number people actually came for.
 */
export const OccupancyChart = ({
  occupied,
  vacant,
  maintenance = 0,
  reserved = 0,
  height = 300,
}: OccupancyChartProps) => {
  const slices = [
    { name: 'Occupied', value: occupied, color: CHART_COLORS.brand },
    { name: 'Vacant', value: vacant, color: CHART_COLORS.neutral },
    { name: 'Under maintenance', value: maintenance, color: CHART_COLORS.warning },
    { name: 'Reserved', value: reserved, color: CHART_COLORS.info },
  ].filter((slice) => slice.value > 0);

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  if (total === 0) {
    return <ChartEmpty message="Add units to see the occupancy split." />;
  }

  const rate = Math.round((occupied / total) * 100);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="80%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {slices.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip currency={false} />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>

      {/* Centred figure sits above the donut hole. */}
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
        style={{ top: height * 0.34 }}
      >
        <span className="text-3xl font-semibold tabular text-neutral-900 dark:text-neutral-50">
          {rate}%
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">occupied</span>
      </div>
    </div>
  );
};

OccupancyChart.displayName = 'OccupancyChart';
