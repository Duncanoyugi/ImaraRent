import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, DoorOpen, FileText, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ManagerTask } from '../types/manager-dashboardtypes';

const ICONS = {
  ticket: Wrench,
  invoice: FileText,
  lease: FileText,
  vacancy: DoorOpen,
} as const;

const URGENCY: Record<ManagerTask['urgency'], { label: string; variant: 'error' | 'warning' | 'default' }> = {
  urgent: { label: 'Urgent', variant: 'error' },
  high: { label: 'Soon', variant: 'warning' },
  normal: { label: 'When you can', variant: 'default' },
};

interface Props {
  tasks: ManagerTask[] | undefined;
  isLoading?: boolean;
}

/** What needs doing today, ordered by urgency. The dashboard's main column. */
export const ManagerTaskList = ({ tasks, isLoading }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Needs your attention</CardTitle>
      <CardDescription>Urgent repairs and late rent, most pressing first.</CardDescription>
    </CardHeader>

    <CardContent className="px-0 pb-0">
      {isLoading ? (
        <div className="space-y-1 px-4 pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="You are all caught up"
          description="No urgent repairs, no overdue rent, no empty units."
          compact
        />
      ) : (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {tasks.slice(0, 8).map((task) => {
            const Icon = ICONS[task.kind];
            const urgency = URGENCY[task.urgency];

            return (
              <li key={task.id}>
                <Link
                  to={task.href}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 dark:hover:bg-neutral-800/60"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      task.urgency === 'urgent'
                        ? 'bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400'
                        : task.urgency === 'high'
                          ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {task.title}
                    </span>
                    <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {task.detail}
                    </span>
                  </span>

                  <Badge variant={urgency.variant} className="hidden shrink-0 sm:inline-flex">
                    {urgency.label}
                  </Badge>

                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </CardContent>
  </Card>
);

ManagerTaskList.displayName = 'ManagerTaskList';
