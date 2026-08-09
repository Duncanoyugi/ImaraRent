import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/formatters';
import { FileText } from 'lucide-react';

interface ReportViewerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  metadata?: {
    generatedAt: string;
    period: string;
  };
}

export const ReportViewer = ({
  title,
  subtitle,
  children,
  isLoading = false,
  metadata,
}: ReportViewerProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-500" />
            {title}
          </CardTitle>
          {subtitle && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {metadata && (
          <div className="text-right text-sm text-neutral-500 dark:text-neutral-400">
            <p>Generated: {formatDate(metadata.generatedAt)}</p>
            <p>Period: {metadata.period}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

// Summary Cards Component
export const ReportSummaryCards = ({
  items,
}: {
  items: {
    label: string;
    value: string | number;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  }[];
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`rounded-lg border p-4 ${
            item.variant === 'success'
              ? 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950/20'
              : item.variant === 'warning'
              ? 'border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-950/20'
              : item.variant === 'error'
              ? 'border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-950/20'
              : item.variant === 'info'
              ? 'border-info-200 bg-info-50 dark:border-info-800 dark:bg-info-950/20'
              : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50'
          }`}
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.label}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
};