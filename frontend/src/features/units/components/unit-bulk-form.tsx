import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
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
import { bulkUnitSchema, type BulkUnitFormData } from '../schemas/unit.schemas';
import { type Property } from '@/types/property.types';

interface UnitBulkFormProps {
  onSubmit: (data: BulkUnitFormData) => void;
  isLoading?: boolean;
  properties?: Property[];
  selectedPropertyId?: string;
  hidePropertySelect?: boolean;
}

export const UnitBulkForm = ({
  onSubmit,
  isLoading = false,
  properties = [],
  selectedPropertyId,
  hidePropertySelect = false,
}: UnitBulkFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BulkUnitFormData>({
    resolver: zodResolver(bulkUnitSchema),
    defaultValues: {
      units: [
        {
          number: '',
          floor: '',
          bedrooms: null,
          bathrooms: null,
          squareFeet: null,
          rentAmount: 0,
          status: 'VACANT',
          propertyId: selectedPropertyId || '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'units',
  });

  const addUnit = () => {
    const currentPropertyId = watch('units.0.propertyId') || selectedPropertyId || '';
    append({
      number: '',
      floor: '',
      bedrooms: null,
      bathrooms: null,
      squareFeet: null,
      rentAmount: 0,
      status: 'VACANT',
      propertyId: currentPropertyId,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Property Select (if multiple properties available) */}
      {!hidePropertySelect && properties.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Property <span className="text-error-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => {
              // Update all units with the selected property
              const currentUnits = watch('units');
              currentUnits.forEach((_, index) => {
                setValue(`units.${index}.propertyId`, value);
              });
            }}
            defaultValue={selectedPropertyId}
          >
            <SelectTrigger className="h-11">
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
          {errors.units?.[0]?.propertyId && (
            <p className="text-sm text-error-500">{errors.units[0].propertyId?.message}</p>
          )}
        </div>
      )}

      {/* Unit Forms */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-neutral-900 dark:text-white">
                Unit {index + 1}
              </h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-error-500 hover:text-error-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`bulk-unit-number-${index}`} className="text-sm font-medium">
                  Unit Number <span className="text-error-500">*</span>
                </Label>
                <Input
                  id={`bulk-unit-number-${index}`}
                  placeholder="e.g., A101"
                  {...register(`units.${index}.number`)}
                  className="h-10"
                />
                {errors.units?.[index]?.number && (
                  <p className="text-sm text-error-500">
                    {errors.units[index].number?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`bulk-rent-${index}`} className="text-sm font-medium">
                  Rent Amount (KES) <span className="text-error-500">*</span>
                </Label>
                <Input
                  id={`bulk-rent-${index}`}
                  type="number"
                  placeholder="e.g., 45000"
                  {...register(`units.${index}.rentAmount`, { valueAsNumber: true })}
                  className="h-10"
                />
                {errors.units?.[index]?.rentAmount && (
                  <p className="text-sm text-error-500">
                    {errors.units[index].rentAmount?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`bulk-floor-${index}`} className="text-sm font-medium">
                  Floor
                </Label>
                <Input
                  id={`bulk-floor-${index}`}
                  placeholder="e.g., 3rd Floor"
                  {...register(`units.${index}.floor`)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`bulk-bedrooms-${index}`} className="text-sm font-medium">
                  Bedrooms
                </Label>
                <Input
                  id={`bulk-bedrooms-${index}`}
                  type="number"
                  placeholder="e.g., 2"
                  {...register(`units.${index}.bedrooms`, { valueAsNumber: true })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`bulk-bathrooms-${index}`} className="text-sm font-medium">
                  Bathrooms
                </Label>
                <Input
                  id={`bulk-bathrooms-${index}`}
                  type="number"
                  placeholder="e.g., 1"
                  {...register(`units.${index}.bathrooms`, { valueAsNumber: true })}
                  className="h-10"
                />
              </div>
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`bulk-sqft-${index}`} className="text-sm font-medium">
                  Square Feet
                </Label>
                <Input
                  id={`bulk-sqft-${index}`}
                  type="number"
                  placeholder="e.g., 850"
                  {...register(`units.${index}.squareFeet`, { valueAsNumber: true })}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`bulk-status-${index}`} className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  onValueChange={(value) => setValue(`units.${index}.status`, value as any)}
                  defaultValue="VACANT"
                >
                  <SelectTrigger className="h-10" id={`bulk-status-${index}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VACANT">Vacant</SelectItem>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="RESERVED">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Unit Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addUnit}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Another Unit
      </Button>

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
          {isLoading ? 'Creating...' : `Create ${fields.length} Unit${fields.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  );
};