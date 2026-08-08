import { z } from 'zod';

export const createInvoiceSchema = z.object({
  dueDate: z
    .string()
    .min(1, 'Due date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  totalAmount: z
    .number()
    .min(0, 'Total amount must be 0 or more'),
  description: z
    .string()
    .optional()
    .nullable(),
  leaseId: z
    .string()
    .min(1, 'Lease is required'),
});

export const generateInvoicesSchema = z.object({
  periodStart: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  periodEnd: z
    .string()
    .min(1, 'End date is required')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format'),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;
export type GenerateInvoicesFormData = z.infer<typeof generateInvoicesSchema>;