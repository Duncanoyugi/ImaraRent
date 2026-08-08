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
import { createTicketSchema, type CreateTicketFormData } from '../schemas/maintenance.schemas';
import type { Unit } from '@/types/unit.types';

interface TicketFormProps {
  initialData?: CreateTicketFormData;
  onSubmit: (data: CreateTicketFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  units?: Unit[];
  selectedUnitId?: string;
  hideUnitSelect?: boolean;
}

export const TicketForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Ticket',
  units = [],
  selectedUnitId,
  hideUnitSelect = false,
}: TicketFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      priority: 'MEDIUM',
      unitId: selectedUnitId || '',
    },
  });

  const priority = watch('priority');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-error-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Leaking tap in kitchen"
          error={errors.title?.message}
          {...register('title')}
          className="h-11"
        />
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

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-error-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the issue in detail..."
          rows={5}
          error={errors.description?.message}
          {...register('description')}
          className="resize-none min-h-[120px]"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Include as much detail as possible to help with diagnosis
        </p>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm font-medium">
          Priority
        </Label>
        <Select
          onValueChange={(value) => setValue('priority', value as CreateTicketFormData['priority'])}
          defaultValue={priority || initialData?.priority || 'MEDIUM'}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low - Cosmetic issues</SelectItem>
            <SelectItem value="MEDIUM">Medium - Non-urgent repairs</SelectItem>
            <SelectItem value="HIGH">High - Disruptive issues</SelectItem>
            <SelectItem value="URGENT">Urgent - Emergency</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-sm text-error-500">{errors.priority.message}</p>
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