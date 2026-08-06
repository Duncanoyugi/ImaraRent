import { z } from 'zod';

export const tenantSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be at most 15 characters'),
  nationalId: z
    .string()
    .min(8, 'National ID must be at least 8 characters')
    .max(20, 'National ID must be at most 20 characters')
    .optional()
    .nullable(),
  dateOfBirth: z
    .string()
    .optional()
    .nullable(),
  unitId: z
    .string()
    .min(1, 'Unit is required'),
});

export const updateTenantSchema = tenantSchema.partial().extend({
  status: z
    .enum(['PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED'])
    .optional(),
});

export const acceptInvitationSchema = z
  .object({
    token: z.string().min(1, 'Invalid invitation token'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type TenantFormData = z.infer<typeof tenantSchema>;
export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;
export type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;