import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantStyles = {
  default: 'bg-white dark:bg-neutral-900',
  success: 'bg-success-50 dark:bg-success-950/20 border-success-200 dark:border-success-800',
  warning: 'bg-warning-50 dark:bg-warning-950/20 border-warning-200 dark:border-warning-800',
  error: 'bg-error-50 dark:bg-error-950/20 border-error-200 dark:border-error-800',
  info: 'bg-info-50 dark:bg-info-950/20 border-info-200 dark:border-info-800',
};

const iconStyles = {
  default: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300',
  error: 'bg-error-100 text-error-700 dark:bg-error-900/50 dark:text-error-300',
  info: 'bg-info-100 text-info-700 dark:bg-info-900/50 dark:text-info-300',
};

export const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
  variant = 'default',
}: StatCardProps) => {
  return (
    <Card className={cn('border transition-all hover:shadow-md', variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
              {value}
            </p>
            {description && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error-500" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-success-600' : 'text-error-600'
                  )}
                >
                  {trend.value}%
                </span>
                <span className="text-sm text-neutral-500">
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div className={cn('rounded-xl p-3', iconStyles[variant])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};