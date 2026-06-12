import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/AppError.js';
import { generateSlots, slotsOverlap } from '../utils/slots.js';

export async function getAvailableSlots(serviceId, dateStr) {
  // Validar que la fecha no sea pasada
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    throw new AppError('INVALID_DATE', 'La fecha no puede ser en el pasado', 400);
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new AppError('NOT_FOUND', 'Servicio no encontrado', 404);
  if (!service.isActive) throw new AppError('SERVICE_INACTIVE', 'El servicio no está activo', 400);

  // 0 = domingo en JS, igual que en el modelo
  const dayOfWeek = date.getDay();

  const availabilityRanges = await prisma.availability.findMany({
    where: { serviceId, dayOfWeek },
  });

  if (availabilityRanges.length === 0) return [];

  // Turnos existentes (no cancelados) para ese servicio y fecha
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      serviceId,
      date: date,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  // Generar todos los slots posibles para cada rango de disponibilidad
  const allSlots = availabilityRanges.flatMap((range) =>
    generateSlots(range.startTime, range.endTime, service.duration)
  );

  // Filtrar los slots que se solapan con turnos existentes
  return allSlots.filter((slot) =>
    !existingAppointments.some((appt) =>
      slotsOverlap(slot.startTime, slot.endTime, appt.startTime, appt.endTime)
    )
  );
}

export async function createAvailability(data) {
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) throw new AppError('NOT_FOUND', 'Servicio no encontrado', 404);

  return prisma.availability.create({ data });
}

export async function deleteAvailability(id) {
  const existing = await prisma.availability.findUnique({ where: { id } });
  if (!existing) throw new AppError('NOT_FOUND', 'Disponibilidad no encontrada', 404);

  return prisma.availability.delete({ where: { id } });
}
