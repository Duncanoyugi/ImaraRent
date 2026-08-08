import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { manualPaymentSchema, type ManualPaymentFormData } from '../schemas/payment.schemas';
import type { Tenant } from '@/types/tenant.types';

interface ManualPaymentFormProps {
  tenants: Tenant[];
  onSubmit: (data: ManualPaymentFormData) => void;
  isLoading?: boolean;
}

export const ManualPaymentForm = ({
  tenants,
  onSubmit,
  isLoading = false,
}: ManualPaymentFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ManualPaymentFormData>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      tenantId: '',
      amount: 0,
      method: 'CASH',
      reference: '',
      notes: '',
    },
  });

  const selectedMethod = watch('method');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tenant Selection */}
      <div className="space-y-2">
        <Label htmlFor="tenantId" className="text-sm font-medium">
          Tenant <span className="text-error-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue('tenantId', value)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a tenant" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                {tenant.firstName} {tenant.lastName} - {tenant.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tenantId && (
          <p className="text-sm text-error-500">{errors.tenantId.message}</p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          Amount (KES) <span className="text-error-500">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          placeholder="e.g., 45000"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
          className="h-11"
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Label htmlFor="method" className="text-sm font-medium">
          Payment Method <span className="text-error-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue('method', value as 'CASH' | 'BANK_TRANSFER' | 'CARD')}
          defaultValue="CASH"
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="CARD">Card</SelectItem>
          </SelectContent>
        </Select>
        {errors.method && (
          <p className="text-sm text-error-500">{errors.method.message}</p>
        )}
      </div>

      {/* Reference */}
      <div className="space-y-2">
        <Label htmlFor="reference" className="text-sm font-medium">
          Reference
        </Label>
        <Input
          id="reference"
          placeholder={
            selectedMethod === 'BANK_TRANSFER' 
              ? 'e.g., TRF-2024-001' 
              : 'Optional reference'
          }
          error={errors.reference?.message}
          {...register('reference')}
          className="h-11"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {selectedMethod === 'BANK_TRANSFER' 
            ? 'Enter the bank transaction reference' 
            : 'Optional reference for your records'}
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Additional notes about this payment..."
          rows={3}
          error={errors.notes?.message}
          {...register('notes')}
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="h-11"
        >
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={isLoading} className="h-11">
          {isLoading ? 'Recording...' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
};