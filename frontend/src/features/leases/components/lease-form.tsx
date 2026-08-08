import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { leaseSchema, type LeaseFormData } from '../schemas/lease.schemas';
import { type Tenant } from '@/types/tenant.types';
import { type Unit } from '@/types/unit.types';

interface LeaseFormProps {
  initialData?: LeaseFormData;
  onSubmit: (data: LeaseFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  tenants?: Tenant[];
  units?: Unit[];
  selectedTenantId?: string;
  selectedUnitId?: string;
  hideTenantSelect?: boolean;
  hideUnitSelect?: boolean;
}

export const LeaseForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Lease',
  tenants = [],
  units = [],
  selectedTenantId,
  selectedUnitId,
  hideTenantSelect = false,
  hideUnitSelect = false,
}: LeaseFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: initialData || {
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      rentAmount: 0,
      depositAmount: 0,
      tenantId: selectedTenantId || '',
      unitId: selectedUnitId || '',
    },
  });

  const { errors } = useFormState({ control });
  const startDate = watch('startDate');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tenant Selection */}
      {!hideTenantSelect && tenants.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="tenantId" className="text-sm font-medium">
            Tenant <span className="text-error-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue('tenantId', value)}
            {...(initialData?.tenantId || selectedTenantId ? { defaultValue: initialData?.tenantId || selectedTenantId } : {})}
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
        </div>
      )}

      {/* Hidden tenantId when tenant select is hidden (edit mode or no tenants) */}
      {(hideTenantSelect || tenants.length === 0) && (
        <input type="hidden" {...register('tenantId')} />
      )}

      {/* No tenants available message */}
      {!hideTenantSelect && tenants.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No active tenants available</p>
      )}

      {/* Tenant error message */}
      {errors.tenantId && !hideTenantSelect && (
        <p className="text-sm text-error-500">{errors.tenantId.message}</p>
      )}

      {/* Unit Selection */}
      {!hideUnitSelect && units.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="unitId" className="text-sm font-medium">
            Unit <span className="text-error-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue('unitId', value)}
            {...(initialData?.unitId || selectedUnitId ? { defaultValue: initialData?.unitId || selectedUnitId } : {})}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.property?.name} - Unit {unit.number}
                  {unit.status === 'OCCUPIED' && ' (Occupied)'}
                  {unit.status === 'MAINTENANCE' && ' (Maintenance)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Hidden unitId when unit select is hidden (edit mode or no units) */}
      {(hideUnitSelect || units.length === 0) && (
        <input type="hidden" {...register('unitId')} />
      )}

      {/* No units available message */}
      {!hideUnitSelect && units.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No available units</p>
      )}

      {/* Unit error message */}
      {errors.unitId && !hideUnitSelect && (
        <p className="text-sm text-error-500">{errors.unitId.message}</p>
      )}

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date <span className="text-error-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            min={startDate}
            error={errors.endDate?.message}
            {...register('endDate')}
            className="h-11"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Leave empty for open-ended lease
          </p>
        </div>
      </div>

      {/* Rent & Deposit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rentAmount" className="text-sm font-medium">
            Rent Amount (KES) <span className="text-error-500">*</span>
          </Label>
          <Input
            id="rentAmount"
            type="number"
            placeholder="e.g., 45000"
            error={errors.rentAmount?.message}
            {...register('rentAmount', { valueAsNumber: true })}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositAmount" className="text-sm font-medium">
            Deposit Amount (KES)
          </Label>
          <Input
            id="depositAmount"
            type="number"
            placeholder="e.g., 45000"
            error={errors.depositAmount?.message}
            {...register('depositAmount', { valueAsNumber: true })}
            className="h-11"
          />
        </div>
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
          {isLoading ? 'Creating...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export type { LeaseFormData };
