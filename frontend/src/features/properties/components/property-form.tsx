import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { propertySchema, type PropertyFormData } from '../schemas/property.schemas';

interface PropertyFormProps {
  initialData?: PropertyFormData;
  onSubmit: (data: PropertyFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const PropertyForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Property',
}: PropertyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      address: '',
      city: '',
      county: '',
      postalCode: '',
      latitude: null,
      longitude: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Row 1: Property Name - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Property Name <span className="text-error-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., Sunset Apartments"
          error={errors.name?.message}
          {...register('name')}
          className="h-11"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Give your property a descriptive name
        </p>
      </div>

      {/* Row 2: Address - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Address <span className="text-error-500">*</span>
        </Label>
        <Input
          id="address"
          placeholder="e.g., 123 Ngong Road"
          error={errors.address?.message}
          {...register('address')}
          className="h-11"
        />
      </div>

      {/* Row 3: Description - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your property - location, amenities, features, etc."
          rows={4}
          error={errors.description?.message}
          {...register('description')}
          className="resize-none min-h-[100px]"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Optional: Add details about the property
        </p>
      </div>

      {/* Row 4: City & County - 2 Columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City <span className="text-error-500">*</span>
          </Label>
          <Input
            id="city"
            placeholder="e.g., Nairobi"
            error={errors.city?.message}
            {...register('city')}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="county" className="text-sm font-medium">
            County <span className="text-error-500">*</span>
          </Label>
          <Input
            id="county"
            placeholder="e.g., Nairobi"
            error={errors.county?.message}
            {...register('county')}
            className="h-11"
          />
        </div>
      </div>

      {/* Row 5: Postal Code, Latitude, Longitude - 3 Columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-medium">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            placeholder="e.g., 00100"
            error={errors.postalCode?.message}
            {...register('postalCode')}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="latitude" className="text-sm font-medium">
            Latitude
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="e.g., -1.2921"
            error={errors.latitude?.message}
            {...register('latitude', { valueAsNumber: true })}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude" className="text-sm font-medium">
            Longitude
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="e.g., 36.8219"
            error={errors.longitude?.message}
            {...register('longitude', { valueAsNumber: true })}
            className="h-11"
          />
        </div>
      </div>

      {/* Row 6: Actions */}
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="h-11 px-6"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          loading={isLoading} 
          disabled={isLoading} 
          className="h-11 px-8"
        >
          {isLoading ? 'Creating...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};