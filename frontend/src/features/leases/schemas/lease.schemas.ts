import { z } from 'zod';

export const leaseSchema = z
  .object({
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    endDate: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format'),
    rentAmount: z
      .number()
      .min(0, 'Rent amount must be 0 or more'),
    depositAmount: z
      .number()
      .min(0, 'Deposit amount must be 0 or more')
      .optional()
      .nullable(),
    tenantId: z
      .string()
      .min(1, 'Tenant is required'),
    unitId: z
      .string()
      .min(1, 'Unit is required'),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export const updateLeaseSchema = leaseSchema.partial().extend({
  status: z
    .enum(['DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED'])
    .optional(),
  isActive: z.boolean().optional(),
  terminationReason: z.string().optional(),
});

export type LeaseFormData = z.infer<typeof leaseSchema>;
export type UpdateLeaseFormData = z.infer<typeof updateLeaseSchema>;