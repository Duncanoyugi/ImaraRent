import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { assignTicketSchema, type AssignTicketFormData } from '../schemas/maintenance.schemas';
import type { User } from '@/types/user.types';

interface TicketAssignFormProps {
  users: User[];
  onSubmit: (data: AssignTicketFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const TicketAssignForm = ({
  users,
  onSubmit,
  isLoading = false,
  onCancel,
}: TicketAssignFormProps) => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssignTicketFormData>({
    resolver: zodResolver(assignTicketSchema),
    defaultValues: {
      assignedToId: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assignedToId" className="text-sm font-medium">
          Assign To <span className="text-error-500">*</span>
        </Label>
        <Select onValueChange={(value) => setValue('assignedToId', value)}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName} - {user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.assignedToId && (
          <p className="text-sm text-error-500">{errors.assignedToId.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Assigning...' : 'Assign Ticket'}
        </Button>
      </div>
    </form>
  );
};