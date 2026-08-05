import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OccupancyDataPoint {
  name: string;
  value: number;
  color: string;
}

interface OccupancyChartProps {
  occupied: number;
  vacant: number;
  maintenance?: number;
  isLoading?: boolean;
}

const COLORS = ['#059669', '#94a3b8', '#f59e0b'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-md dark:border-neutral-700 dark:bg-neutral-900">
        <p className="font-medium text-neutral-900 dark:text-white">
          {payload[0].name}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {payload[0].value} units
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {((payload[0].value / (payload[0].payload.total || 1)) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export const OccupancyChart = ({
  occupied,
  vacant,
  maintenance = 0,
  isLoading = false,
}: OccupancyChartProps) => {
  const total = occupied + vacant + maintenance;
  
  const data: OccupancyDataPoint[] = [
    { name: 'Occupied', value: occupied, color: COLORS[0] },
    { name: 'Vacant', value: vacant, color: COLORS[1] },
  ];

  if (maintenance > 0) {
    data.push({ name: 'Maintenance', value: maintenance, color: COLORS[2] });
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </CardContent>
      </Card>
    );
  }

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-neutral-500 dark:text-neutral-400">
              No units available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {value}: {entry.payload.value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};