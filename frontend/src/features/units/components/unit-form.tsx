import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import { unitSchema, type UnitFormData } from '../schemas/unit.schemas';
import { type Property } from '@/types/property.types';

interface UnitFormProps {
  initialData?: UnitFormData;
  onSubmit: (data: UnitFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  properties?: Property[];
  selectedPropertyId?: string;
  hidePropertySelect?: boolean;
}

export const UnitForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Unit',
  properties = [],
  selectedPropertyId,
  hidePropertySelect = false,
}: UnitFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: initialData || {
      number: '',
      floor: '',
      bedrooms: null,
      bathrooms: null,
      squareFeet: null,
      rentAmount: 0,
      status: 'VACANT',
      propertyId: selectedPropertyId || '',
    },
  });

  // Set propertyId if provided and not hidden
  useEffect(() => {
    if (selectedPropertyId && !hidePropertySelect) {
      setValue('propertyId', selectedPropertyId);
    }
  }, [selectedPropertyId, hidePropertySelect, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Unit Number */}
      <div className="space-y-2">
        <Label htmlFor="unit-number" className="text-sm font-medium">
          Unit Number <span className="text-error-500">*</span>
        </Label>
        <Input
          id="unit-number"
          placeholder="e.g., A101"
          error={errors.number?.message}
          {...register('number')}
          className="h-11"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          A unique identifier for this unit (e.g., A101, 3B, Studio-1)
        </p>
      </div>

      {/* Property Select */}
      {!hidePropertySelect && properties.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="property-select" className="text-sm font-medium">
            Property <span className="text-error-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue('propertyId', value)}
            defaultValue={initialData?.propertyId || selectedPropertyId}
          >
            <SelectTrigger className="h-11" id="property-select">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyId && (
            <p className="text-sm text-error-500">{errors.propertyId.message}</p>
          )}
        </div>
      )}

      {/* Floor */}
      <div className="space-y-2">
        <Label htmlFor="floor" className="text-sm font-medium">
          Floor
        </Label>
        <Input
          id="floor"
          placeholder="e.g., Ground Floor, 3rd Floor"
          error={errors.floor?.message}
          {...register('floor')}
          className="h-11"
        />
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bedrooms" className="text-sm font-medium">
            Bedrooms
          </Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="e.g., 2"
            error={errors.bedrooms?.message}
            {...register('bedrooms', { valueAsNumber: true })}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="text-sm font-medium">
            Bathrooms
          </Label>
          <Input
            id="bathrooms"
            type="number"
            placeholder="e.g., 1"
            error={errors.bathrooms?.message}
            {...register('bathrooms', { valueAsNumber: true })}
            className="h-11"
          />
        </div>
      </div>

      {/* Square Feet & Rent Amount */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="squareFeet" className="text-sm font-medium">
            Square Feet
          </Label>
          <Input
            id="squareFeet"
            type="number"
            placeholder="e.g., 850"
            error={errors.squareFeet?.message}
            {...register('squareFeet', { valueAsNumber: true })}
            className="h-11"
          />
        </div>
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
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status-select" className="text-sm font-medium">
          Status
        </Label>
        <Select
          onValueChange={(value) => setValue('status', value as any)}
          defaultValue={initialData?.status || 'VACANT'}
        >
          <SelectTrigger className="h-11" id="status-select">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VACANT">Vacant</SelectItem>
            <SelectItem value="OCCUPIED">Occupied</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="RESERVED">Reserved</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-error-500">{errors.status.message}</p>
        )}
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