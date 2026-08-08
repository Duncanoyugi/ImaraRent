import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  unitId: z
    .string()
    .min(1, 'Unit is required'),
});

export const updateTicketSchema = createTicketSchema.partial().extend({
  status: z
    .enum(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'])
    .optional(),
  assignedToId: z
    .string()
    .optional()
    .nullable(),
  cost: z
    .number()
    .min(0, 'Cost must be 0 or more')
    .optional()
    .nullable(),
  resolutionNotes: z
    .string()
    .max(500, 'Resolution notes must be at most 500 characters')
    .optional(),
});

export const assignTicketSchema = z.object({
  assignedToId: z
    .string()
    .min(1, 'Please select a user to assign'),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type UpdateTicketFormData = z.infer<typeof updateTicketSchema>;
export type AssignTicketFormData = z.infer<typeof assignTicketSchema>;