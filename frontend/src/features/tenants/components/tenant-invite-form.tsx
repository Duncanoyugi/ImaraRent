import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send } from 'lucide-react';
import { tenantSchema, type TenantFormData } from '../schemas/tenant.schemas';

interface TenantInviteFormProps {
  onSubmit: (data: TenantFormData) => void;
  isLoading?: boolean;
}

export const TenantInviteForm = ({
  onSubmit,
  isLoading = false,
}: TenantInviteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationalId: '',
      dateOfBirth: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invite Tenant
        </CardTitle>
        <CardDescription>
          Send an invitation email to the tenant to create their account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="e.g., Mary"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="e.g., Wambui"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., mary@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="e.g., 0712345678"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID</Label>
              <Input
                id="nationalId"
                placeholder="e.g., 12345678"
                error={errors.nationalId?.message}
                {...register('nationalId')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            <Send className="mr-2 h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};