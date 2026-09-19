import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Save, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRoleBadge } from './user-role-badge';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useChangePassword, useUpdateUser } from '../hooks/use-user';
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from '../schemas/user.schemas';
import { passwordStrength } from '@/utils/validators';
import { initials } from '@/utils/string-helpers';
import { cn } from '@/lib/utils';

/**
 * Profile screen shared by all three roles: identity, contact details and
 * password. Email is read-only — it is the login identifier and changing it
 * would need a re-verification flow the API does not expose.
 */
export const UserProfile = () => {
  const { user } = useAuth();
  const update = useUpdateUser();
  const changePassword = useChangePassword();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '' },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!user) return;
    profileForm.reset({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
    });
  }, [user, profileForm]);

  const newPassword = passwordForm.watch('newPassword');
  const strength = passwordStrength(newPassword ?? '');

  if (!user) return null;

  const onSaveProfile = profileForm.handleSubmit((values) => {
    update.mutate(
      {
        id: user.id,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone || null,
        },
      },
      { onSuccess: () => profileForm.reset(values) }
    );
  });

  const onChangePassword = passwordForm.handleSubmit((values) => {
    changePassword.mutate(
      {
        id: user.id,
        data: { currentPassword: values.currentPassword, newPassword: values.newPassword },
      },
      { onSuccess: () => passwordForm.reset() }
    );
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-lg font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {initials(user.firstName, user.lastName)}
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="truncate">{user.email}</CardDescription>
              <div className="mt-2">
                <UserRoleBadge role={user.role} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <UserCircle className="h-4.5 w-4.5" />
            </span>
            <div>
              <CardTitle>Your details</CardTitle>
              <CardDescription>How your name appears to tenants and colleagues.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSaveProfile} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  {...profileForm.register('firstName')}
                  aria-invalid={!!profileForm.formState.errors.firstName}
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-xs text-error-600">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  {...profileForm.register('lastName')}
                  aria-invalid={!!profileForm.formState.errors.lastName}
                />
                {profileForm.formState.errors.lastName && (
                  <p className="text-xs text-error-600">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} readOnly disabled />
                <p className="text-xs text-neutral-500">
                  This is your sign-in address and cannot be changed here.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...profileForm.register('phone')}
                  placeholder="0712 345 678"
                  aria-invalid={!!profileForm.formState.errors.phone}
                />
                {profileForm.formState.errors.phone && (
                  <p className="text-xs text-error-600">
                    {profileForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                loading={update.isPending}
                disabled={!profileForm.formState.isDirty}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <KeyRound className="h-4.5 w-4.5" />
            </span>
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                You stay signed in on this device after changing it.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onChangePassword} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register('currentPassword')}
                aria-invalid={!!passwordForm.formState.errors.currentPassword}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-error-600">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register('newPassword')}
                  aria-invalid={!!passwordForm.formState.errors.newPassword}
                />
                {newPassword && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex h-1 flex-1 gap-1" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={cn(
                            'h-full flex-1 rounded-full transition-colors',
                            i < strength.score
                              ? strength.score <= 1
                                ? 'bg-error-500'
                                : strength.score <= 2
                                  ? 'bg-warning-500'
                                  : strength.score === 3
                                    ? 'bg-info-500'
                                    : 'bg-success-500'
                              : 'bg-neutral-200 dark:bg-neutral-700'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">{strength.label}</span>
                  </div>
                )}
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-error-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Repeat new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register('confirmPassword')}
                  aria-invalid={!!passwordForm.formState.errors.confirmPassword}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-error-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {strength.hints.length > 0 && newPassword && (
              <Alert variant="info">
                <AlertDescription>{strength.hints.join(' · ')}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" loading={changePassword.isPending} className="gap-2">
                <KeyRound className="h-4 w-4" />
                Change password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

UserProfile.displayName = 'UserProfile';
