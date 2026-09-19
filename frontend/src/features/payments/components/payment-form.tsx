import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Banknote, CreditCard, Landmark, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioCard } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/forms/form-field';
import { useRecordManualPayment } from '../hooks/use-payments';
import { money } from '@/utils/currency-formatter';
import { isPositiveAmount } from '@/utils/validators';

const METHODS = [
  {
    value: 'CASH',
    label: 'Cash',
    description: 'Paid in person',
    icon: <Banknote className="h-4.5 w-4.5" />,
  },
  {
    value: 'BANK_TRANSFER',
    label: 'Bank transfer',
    description: 'Deposit or EFT',
    icon: <Landmark className="h-4.5 w-4.5" />,
  },
  {
    value: 'CARD',
    label: 'Card',
    description: 'Card terminal',
    icon: <CreditCard className="h-4.5 w-4.5" />,
  },
] as const;

const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'Enter the amount received')
    .refine((value) => isPositiveAmount(value), 'Enter an amount greater than zero'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'CARD']),
  reference: z.string().trim().max(60, 'Keep the reference under 60 characters').optional(),
  notes: z.string().trim().max(300, 'Keep notes under 300 characters').optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export interface PaymentFormProps {
  tenantId: string;
  tenantName?: string;
  /** Prefills the amount — usually the invoice balance. */
  suggestedAmount?: number;
  onRecorded?: () => void;
  onCancel?: () => void;
}

/**
 * Records a payment taken outside the system — cash, a bank deposit, a card
 * terminal. M-Pesa is never recorded here: those arrive through the Daraja
 * callback, and entering one by hand would double-count it.
 *
 * The API allocates the amount across the tenant's open invoices oldest
 * first, so this form takes a tenant rather than an invoice.
 */
export const PaymentForm = ({
  tenantId,
  tenantName,
  suggestedAmount,
  onRecorded,
  onCancel,
}: PaymentFormProps) => {
  const record = useRecordManualPayment();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: suggestedAmount ? String(suggestedAmount) : '',
      method: 'CASH',
      reference: '',
      notes: '',
    },
  });

  const method = watch('method');
  const amount = Number(watch('amount') || 0);

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    record.mutate(
      {
        tenantId,
        amount: Number(values.amount),
        method: values.method,
        reference: values.reference || null,
        notes: values.notes || null,
      },
      {
        onSuccess: () => onRecorded?.(),
        onError: (error: unknown) =>
          setServerError(
            error instanceof Error ? error.message : 'Could not record the payment.'
          ),
      }
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {serverError && (
        <Alert variant="error">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {tenantName && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Recording a payment from{' '}
          <strong className="text-neutral-900 dark:text-neutral-100">{tenantName}</strong>.
        </p>
      )}

      <FormField
        label="Amount received"
        required
        error={errors.amount}
        description={
          suggestedAmount
            ? `Outstanding balance is ${money(suggestedAmount)}.`
            : 'Applied to the oldest unpaid invoice first.'
        }
      >
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          {...register('amount')}
        />
      </FormField>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          How was it paid?
        </legend>
        <RadioGroup
          value={method}
          onValueChange={(value) => setValue('method', value as PaymentFormValues['method'])}
          className="sm:grid-cols-3"
        >
          {METHODS.map((option) => (
            <RadioCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              icon={option.icon}
            />
          ))}
        </RadioGroup>
      </fieldset>

      <FormField
        label="Reference"
        error={errors.reference}
        hint="Optional"
        description={
          method === 'BANK_TRANSFER'
            ? 'Bank slip or transaction number.'
            : method === 'CARD'
              ? 'Terminal receipt number.'
              : 'Receipt book number, if you issued one.'
        }
      >
        <Input placeholder="e.g. RCT-00214" {...register('reference')} />
      </FormField>

      <FormField label="Notes" error={errors.notes} hint="Optional">
        <Textarea rows={3} placeholder="Anything worth recording about this payment" {...register('notes')} />
      </FormField>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
        {amount > 0 && (
          <p className="mr-auto text-sm text-neutral-500 dark:text-neutral-400">
            Recording{' '}
            <strong className="tabular text-neutral-900 dark:text-neutral-100">
              {money(amount)}
            </strong>
          </p>
        )}

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={record.isPending}>
            Cancel
          </Button>
        )}

        <Button type="submit" loading={record.isPending} className="gap-2">
          <Receipt className="h-4 w-4" />
          Record payment
        </Button>
      </div>
    </form>
  );
};

PaymentForm.displayName = 'PaymentForm';
