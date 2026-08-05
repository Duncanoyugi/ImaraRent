import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS';
  unitNumber: string;
  propertyName: string;
  createdAt: string;
}

interface MaintenanceAlertsProps {
  alerts: Alert[];
  isLoading?: boolean;
}

const priorityConfig = {
  LOW: { color: 'text-success-500 bg-success-50 dark:bg-success-950/20', icon: Info },
  MEDIUM: { color: 'text-info-500 bg-info-50 dark:bg-info-950/20', icon: Info },
  HIGH: { color: 'text-warning-500 bg-warning-50 dark:bg-warning-950/20', icon: AlertTriangle },
  URGENT: { color: 'text-error-500 bg-error-50 dark:bg-error-950/20', icon: AlertCircle },
};

const statusConfig = {
  OPEN: 'error',
  ASSIGNED: 'warning',
  IN_PROGRESS: 'info',
} as const;

export const MaintenanceAlerts = ({ alerts, isLoading = false }: MaintenanceAlertsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">
              No maintenance alerts
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const PriorityIcon = priorityConfig[alert.priority].icon;
            const priorityColor = priorityConfig[alert.priority].color;

            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
              >
                <div className={cn('rounded-xl p-2', priorityColor)}>
                  <PriorityIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {alert.title}
                    </p>
                    <Badge variant={statusConfig[alert.status]} className="text-[10px] uppercase">
                      {alert.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {alert.propertyName} • Unit {alert.unitNumber}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {formatRelativeTime(alert.createdAt)}
                  </p>
                </div>
                <Badge variant="outline" className={cn('text-[10px] uppercase', priorityColor)}>
                  {alert.priority}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};