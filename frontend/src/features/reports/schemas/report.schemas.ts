import { z } from 'zod';

export const reportPeriods = [
  'CURRENT_MONTH',
  'LAST_MONTH',
  'CURRENT_QUARTER',
  'CURRENT_YEAR',
  'CUSTOM',
] as const;

export const reportFormats = ['JSON', 'CSV', 'PDF'] as const;

export const reportRequestSchema = z
  .object({
    period: z.enum(reportPeriods),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    propertyId: z.string().optional(),
    unitId: z.string().optional(),
    format: z.enum(reportFormats).optional(),
  })
  // A custom period is meaningless without both ends of the range.
  .refine(
    (values) => values.period !== 'CUSTOM' || (!!values.startDate && !!values.endDate),
    { message: 'Choose both a start and an end date', path: ['startDate'] }
  )
  .refine(
    (values) =>
      !values.startDate ||
      !values.endDate ||
      new Date(values.endDate) >= new Date(values.startDate),
    { message: 'The end date cannot be before the start date', path: ['endDate'] }
  );

export type ReportRequestValues = z.infer<typeof reportRequestSchema>;
