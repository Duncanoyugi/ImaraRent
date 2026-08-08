import { z } from 'zod';

export const mpesaPaymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice is required'),
  amount: z
    .number()
    .min(1, 'Amount must be at least 1 KES'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(12, 'Phone number must be at most 12 digits')
    .refine(
      (val) => /^[0-9]{10,12}$/.test(val.replace(/\D/g, '')),
      'Please enter a valid phone number (e.g., 0712345678)'
    ),
});

export const manualPaymentSchema = z.object({
  tenantId: z.string().min(1, 'Tenant is required'),
  amount: z
    .number()
    .min(1, 'Amount must be at least 1 KES'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'CARD']),
  reference: z
    .string()
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional()
    .nullable(),
});

export type MpesaPaymentFormData = z.infer<typeof mpesaPaymentSchema>;
export type ManualPaymentFormData = z.infer<typeof manualPaymentSchema>;