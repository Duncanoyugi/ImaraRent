import { z } from 'zod';

export const propertySchema = z.object({
  name: z
    .string()
    .min(2, 'Property name must be at least 2 characters')
    .max(100, 'Property name must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .nullable(),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be at most 200 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be at most 100 characters'),
  county: z
    .string()
    .min(2, 'County must be at least 2 characters')
    .max(100, 'County must be at most 100 characters'),
  postalCode: z
    .string()
    .max(20, 'Postal code must be at most 20 characters')
    .optional()
    .nullable(),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional()
    .nullable(),
});

export const updatePropertySchema = propertySchema.partial();

export type PropertyFormData = z.infer<typeof propertySchema>;
export type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>;