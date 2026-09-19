import { z } from 'zod';
import { isKenyanPhone } from '@/utils/validators';

const optionalPhone = z
  .string()
  .trim()
  .refine((value) => !value || isKenyanPhone(value), 'Enter a valid Kenyan phone number')
  .or(z.literal(''))
  .optional();

export const inviteManagerSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter a first name'),
  lastName: z.string().trim().min(2, 'Enter a last name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: optionalPhone,
  propertyIds: z
    .array(z.string())
    .min(1, 'Choose at least one property for this manager'),
});

export type InviteManagerFormValues = z.infer<typeof inviteManagerSchema>;

export const profileSchema = z.object({
  firstName: z.string().trim().min(2, 'Enter a first name'),
  lastName: z.string().trim().min(2, 'Enter a last name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: optionalPhone,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[A-Za-z]/, 'Include at least one letter')
      .regex(/\d/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Repeat the new password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'The two passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: 'Choose a password different from your current one',
    path: ['newPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
