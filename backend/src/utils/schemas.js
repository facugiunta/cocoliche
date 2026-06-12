import { z } from 'zod';

export const createAppointmentSchema = z.object({
  serviceId: z.string().uuid('serviceId debe ser un UUID válido'),
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(8, 'Teléfono inválido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora debe tener formato HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora debe tener formato HH:MM'),
  notes: z.string().optional(),
});

export const createServiceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  duration: z.number().int().positive('La duración debe ser un número positivo'),
  isActive: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export const createAvailabilitySchema = z.object({
  serviceId: z.string().uuid('serviceId debe ser un UUID válido'),
  dayOfWeek: z.number().int().min(0).max(6, 'dayOfWeek debe ser entre 0 (domingo) y 6 (sábado)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora debe tener formato HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora debe tener formato HH:MM'),
});

export const updateStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Status debe ser CONFIRMED o CANCELLED' }),
  }),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe tener formato YYYY-MM-DD'),
});

export const appointmentsFilterSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  serviceId: z.string().uuid().optional(),
});
