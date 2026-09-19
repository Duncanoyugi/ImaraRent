import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckboxField } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProperties } from '@/features/properties/hooks/use-properties';
import { useInviteManager } from '../hooks/use-users';
import {
  inviteManagerSchema,
  type InviteManagerFormValues,
} from '../schemas/user.schemas';
import { showToast } from '@/app/providers/toast-provider';
import { errorMessage } from '@/utils/error-handlers';

export interface UserInviteFormProps {
  onInvited?: () => void;
}

/**
 * Invites a manager and assigns their properties in one step.
 *
 * Property selection is required: a manager with no assignments can sign in
 * but sees nothing, which reads as a broken account rather than a
 * permissions boundary.
 */
export const UserInviteForm = ({ onInvited }: UserInviteFormProps) => {
  const { data: properties, isLoading: loadingProperties } = useProperties();
  const invite = useInviteManager();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteManagerFormValues>({
    resolver: zodResolver(inviteManagerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', propertyIds: [] },
  });

  const onSubmit = handleSubmit((values) => {
    invite.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        propertyIds: values.propertyIds,
      },
      {
        onSuccess: (result) => {
          reset();
          showToast.success(
            'Manager invited',
            result?.emailSent
              ? `An invitation email is on its way to ${values.email}.`
              : `Account created, but the invitation email could not be sent to ${values.email}.`
          );
          onInvited?.();
        },
        onError: (error) => showToast.error('Could not send invitation', errorMessage(error)),
      }
    );
  });

  const hasProperties = (properties?.length ?? 0) > 0;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="invite-firstName">First name</Label>
          <Input
            id="invite-firstName"
            {...register('firstName')}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="text-xs text-error-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invite-lastName">Last name</Label>
          <Input id="invite-lastName" {...register('lastName')} aria-invalid={!!errors.lastName} />
          {errors.lastName && <p className="text-xs text-error-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            placeholder="manager@example.co.ke"
          />
          {errors.email && <p className="text-xs text-error-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invite-phone">Phone (optional)</Label>
          <Input
            id="invite-phone"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            placeholder="0712 345 678"
          />
          {errors.phone && <p className="text-xs text-error-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Properties this manager looks after</Label>

        {loadingProperties ? (
          <p className="text-sm text-neutral-500">Loading properties…</p>
        ) : !hasProperties ? (
          <Alert variant="warning">
            <AlertDescription>
              Add a property first — a manager needs at least one to work with.
            </AlertDescription>
          </Alert>
        ) : (
          <Controller
            control={control}
            name="propertyIds"
            render={({ field }) => (
              <div className="grid gap-2 rounded-xl border border-neutral-200 p-3 sm:grid-cols-2 dark:border-neutral-800">
                {properties!.map((property) => {
                  const checked = field.value.includes(property.id);
                  return (
                    <CheckboxField
                      key={property.id}
                      label={property.name}
                      description={property.address}
                      checked={checked}
                      onCheckedChange={(next) =>
                        field.onChange(
                          next === true
                            ? [...field.value, property.id]
                            : field.value.filter((id) => id !== property.id)
                        )
                      }
                    />
                  );
                })}
              </div>
            )}
          />
        )}

        {errors.propertyIds && (
          <p className="text-xs text-error-600">{errors.propertyIds.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={invite.isPending}
          disabled={!hasProperties}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Send invitation
        </Button>
      </div>
    </form>
  );
};

UserInviteForm.displayName = 'UserInviteForm';
