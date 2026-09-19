import { z } from 'zod';
import { isKenyanPhone } from '@/utils/validators';

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Give the organization a name of at least 2 characters')
    .max(120, 'Keep the name under 120 characters'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .or(z.literal(''))
    .optional()
    .nullable(),
  phone: z
    .string()
    .trim()
    .refine((value) => !value || isKenyanPhone(value), 'Enter a valid Kenyan phone number')
    .or(z.literal(''))
    .optional()
    .nullable(),
  address: z
    .string()
    .trim()
    .max(200, 'Keep the address under 200 characters')
    .or(z.literal(''))
    .optional()
    .nullable(),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
