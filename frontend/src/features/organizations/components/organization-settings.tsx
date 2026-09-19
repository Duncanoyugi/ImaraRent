import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrganization, useUpdateOrganization } from '../hooks/use-organization';
import {
  organizationSchema,
  type OrganizationFormValues,
} from '../schemas/organization.schemas';

/**
 * Editable organization profile. These details appear on invoices, receipts
 * and tenant invitation emails, which is why the form says so.
 */
export const OrganizationSettings = () => {
  const { data: organization, isLoading } = useOrganization();
  const update = useUpdateOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: '', email: '', phone: '', address: '' },
  });

  // Populate once the query resolves.
  useEffect(() => {
    if (!organization) return;
    reset({
      name: organization.name ?? '',
      email: organization.email ?? '',
      phone: organization.phone ?? '',
      address: organization.address ?? '',
    });
  }, [organization, reset]);

  const onSubmit = handleSubmit((values) => {
    update.mutate(
      {
        name: values.name,
        email: values.email || null,
        phone: values.phone || null,
        address: values.address || null,
      },
      { onSuccess: () => reset(values) }
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <Building2 className="h-4.5 w-4.5" />
          </span>
          <div>
            <CardTitle>Organization details</CardTitle>
            <CardDescription>
              Shown on invoices, receipts and the emails you send to tenants.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              {...register('name')}
              aria-invalid={!!errors.name}
              placeholder="Imara Properties Ltd"
            />
            {errors.name && <p className="text-xs text-error-600">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="org-email">Billing email</Label>
              <Input
                id="org-email"
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                placeholder="accounts@example.co.ke"
              />
              {errors.email && <p className="text-xs text-error-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-phone">Phone</Label>
              <Input
                id="org-phone"
                {...register('phone')}
                aria-invalid={!!errors.phone}
                placeholder="0712 345 678"
              />
              {errors.phone && <p className="text-xs text-error-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-address">Address</Label>
            <Input
              id="org-address"
              {...register('address')}
              aria-invalid={!!errors.address}
              placeholder="Kimathi Street, Nairobi"
            />
            {errors.address && <p className="text-xs text-error-600">{errors.address.message}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={update.isPending} disabled={!isDirty} className="gap-2">
              <Save className="h-4 w-4" />
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

OrganizationSettings.displayName = 'OrganizationSettings';
