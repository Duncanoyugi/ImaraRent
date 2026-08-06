import { useForm } from 'react-hook-form';
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
import { tenantSchema, type TenantFormData } from '../schemas/tenant.schemas';
import { type Unit } from '@/types/unit.types';

interface TenantFormProps {
  initialData?: TenantFormData;
  onSubmit: (data: TenantFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  units?: Unit[];
  selectedUnitId?: string;
  hideUnitSelect?: boolean;
}

export const TenantForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Tenant',
  units = [],
  selectedUnitId,
  hideUnitSelect = false,
}: TenantFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationalId: '',
      dateOfBirth: '',
      unitId: selectedUnitId || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name - 2 columns */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-error-500">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="e.g., Mary"
            error={errors.firstName?.message}
            {...register('firstName')}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name <span className="text-error-500">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="e.g., Wambui"
            error={errors.lastName?.message}
            {...register('lastName')}
            className="h-11"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-error-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g., mary@example.com"
            error={errors.email?.message}
            {...register('email')}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone <span className="text-error-500">*</span>
          </Label>
          <Input
            id="phone"
            placeholder="e.g., 0712345678"
            error={errors.phone?.message}
            {...register('phone')}
            className="h-11"
          />
        </div>
      </div>

      {/* National ID & Date of Birth */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nationalId" className="text-sm font-medium">
            National ID
          </Label>
          <Input
            id="nationalId"
            placeholder="e.g., 12345678"
            error={errors.nationalId?.message}
            {...register('nationalId')}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-sm font-medium">
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
            className="h-11"
          />
        </div>
      </div>

      {/* Unit Selection */}
      {!hideUnitSelect && units.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="unitId" className="text-sm font-medium">
            Unit <span className="text-error-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue('unitId', value)}
            defaultValue={initialData?.unitId || selectedUnitId}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.property?.name} - Unit {unit.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unitId && (
            <p className="text-sm text-error-500">{errors.unitId.message}</p>
          )}
        </div>
      )}

      {/* Hidden unitId when unit select is hidden (edit mode) */}
      {hideUnitSelect && (
        <input type="hidden" {...register('unitId')} />
      )}

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