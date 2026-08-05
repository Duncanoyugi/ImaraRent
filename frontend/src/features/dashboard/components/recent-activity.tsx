import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { 
  CreditCard, 
  FileText, 
  UserPlus, 
  Wrench, 
  Home, 
  Receipt 
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'payment' | 'tenant' | 'lease' | 'maintenance' | 'property' | 'invoice';
  description: string;
  amount?: number;
  status?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  isLoading?: boolean;
}

const activityIcons = {
  payment: CreditCard,
  tenant: UserPlus,
  lease: FileText,
  maintenance: Wrench,
  property: Home,
  invoice: Receipt,
};

const activityColors = {
  payment: 'text-success-500 bg-success-50 dark:bg-success-950/20',
  tenant: 'text-info-500 bg-info-50 dark:bg-info-950/20',
  lease: 'text-warning-500 bg-warning-50 dark:bg-warning-950/20',
  maintenance: 'text-error-500 bg-error-50 dark:bg-error-950/20',
  property: 'text-brand-500 bg-brand-50 dark:bg-brand-950/20',
  invoice: 'text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50',
};

const statusVariants = {
  completed: 'success',
  pending: 'warning',
  failed: 'error',
  active: 'success',
  closed: 'neutral',
  open: 'info',
} as const;

export const RecentActivity = ({ activities, isLoading = false }: RecentActivityProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400">
              No recent activity
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const iconColor = activityColors[activity.type];
            const statusVariant = activity.status 
              ? statusVariants[activity.status.toLowerCase() as keyof typeof statusVariants] || 'default'
              : 'default';

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <div className={cn('rounded-xl p-2', iconColor)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {activity.description}
                    </p>
                    {activity.amount && (
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                        +KES {activity.amount.toLocaleString()}
                      </span>
                    )}
                    {activity.status && (
                      <Badge variant={statusVariant as any} className="text-[10px] uppercase">
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    {activity.user && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px]">
                            {activity.user.firstName[0]}
                            {activity.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {activity.user.firstName} {activity.user.lastName}
                        </span>
                      </div>
                    )}
                    <span>•</span>
                    <span>{formatRelativeTime(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};