import { z } from 'zod';

export const unitSchema = z.object({
  number: z
    .string()
    .min(1, 'Unit number is required')
    .max(20, 'Unit number must be at most 20 characters'),
  floor: z
    .string()
    .max(50, 'Floor must be at most 50 characters')
    .optional()
    .nullable(),
  bedrooms: z
    .number()
    .min(0, 'Bedrooms must be 0 or more')
    .max(10, 'Bedrooms must be 10 or less')
    .optional()
    .nullable(),
  bathrooms: z
    .number()
    .min(0, 'Bathrooms must be 0 or more')
    .max(10, 'Bathrooms must be 10 or less')
    .optional()
    .nullable(),
  squareFeet: z
    .number()
    .min(1, 'Square feet must be at least 1')
    .max(10000, 'Square feet must be 10,000 or less')
    .optional()
    .nullable(),
  rentAmount: z
    .number()
    .min(0, 'Rent amount must be 0 or more'),
  status: z
    .enum(['VACANT', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'])
    .default('VACANT')
    .optional(),
  propertyId: z
    .string()
    .min(1, 'Property is required'),
});

export const bulkUnitSchema = z.object({
  units: z.array(unitSchema).min(1, 'At least one unit is required'),
});

export const updateUnitSchema = unitSchema.partial();

export type UnitFormData = z.infer<typeof unitSchema>;
export type BulkUnitFormData = z.infer<typeof bulkUnitSchema>;
export type UpdateUnitFormData = z.infer<typeof updateUnitSchema>;