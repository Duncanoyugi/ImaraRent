import { Badge } from '@/components/ui/badge';
import { moneyExact } from '@/utils/currency-formatter';
import { humanizeEnum } from '@/utils/string-helpers';
import { cn } from '@/lib/utils';
import type { InvoiceLine } from '@/types/invoice.types';

const TYPE_VARIANTS: Record<InvoiceLine['type'], 'default' | 'info' | 'warning' | 'success'> = {
  RENT: 'default',
  UTILITY: 'info',
  LATE_FEE: 'warning',
  DISCOUNT: 'success',
  CREDIT_NOTE: 'success',
};

export interface InvoiceLineItemProps {
  line: InvoiceLine;
  className?: string;
}

/**
 * One row of an invoice. Discounts and credit notes are shown as negatives
 * so the column sums visually to the invoice total.
 */
export const InvoiceLineItem = ({ line, className }: InvoiceLineItemProps) => {
  const isCredit = line.type === 'DISCOUNT' || line.type === 'CREDIT_NOTE';

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-3',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-neutral-900 dark:text-neutral-100">
          {line.description}
        </p>
        <Badge variant={TYPE_VARIANTS[line.type] ?? 'default'} className="mt-1 text-[10px]">
          {humanizeEnum(line.type)}
        </Badge>
      </div>

      <p
        className={cn(
          'shrink-0 text-sm font-medium tabular',
          isCredit ? 'text-success-600 dark:text-success-400' : 'text-neutral-900 dark:text-neutral-100'
        )}
      >
        {isCredit ? '-' : ''}
        {moneyExact(Math.abs(Number(line.amount)))}
      </p>
    </div>
  );
};

InvoiceLineItem.displayName = 'InvoiceLineItem';
