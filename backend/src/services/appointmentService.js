import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/AppError.js';
import { slotsOverlap } from '../utils/slots.js';

export async function createAppointment(data) {
  const { serviceId, date, startTime, endTime, clientName, clientEmail, clientPhone, notes } = data;

  // Validar que la fecha no sea pasada
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    throw new AppError('INVALID_DATE', 'La fecha no puede ser en el pasado', 400);
  }

  // Validar que el servicio exista y esté activo
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new AppError('NOT_FOUND', 'Servicio no encontrado', 404);
  if (!service.isActive) throw new AppError('SERVICE_INACTIVE', 'El servicio no está disponible', 400);

  // Verificar que no haya conflicto con turnos existentes
  const conflicts = await prisma.appointment.findMany({
    where: {
      serviceId,
      date: appointmentDate,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  const hasConflict = conflicts.some((appt) =>
    slotsOverlap(startTime, endTime, appt.startTime, appt.endTime)
  );

  if (hasConflict) {
    throw new AppError('APPOINTMENT_CONFLICT', 'El horario seleccionado ya no está disponible', 409);
  }

  return prisma.appointment.create({
    data: {
      serviceId,
      clientName,
      clientEmail,
      clientPhone,
      date: appointmentDate,
      startTime,
      endTime,
      notes,
    },
    include: { service: true },
  });
}

export async function getAppointmentById(id) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { service: true },
  });
  if (!appointment) throw new AppError('NOT_FOUND', 'Turno no encontrado', 404);
  return appointment;
}

export async function cancelAppointment(id) {
  const appointment = await getAppointmentById(id);

  if (appointment.status === 'CANCELLED') {
    throw new AppError('VALIDATION_ERROR', 'El turno ya está cancelado', 400);
  }

  return prisma.appointment.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: { service: true },
  });
}

export async function listAllAppointments(filters) {
  const where = {};

  if (filters.date) {
    where.date = new Date(filters.date);
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.serviceId) {
    where.serviceId = filters.serviceId;
  }

  return prisma.appointment.findMany({
    where,
    include: { service: true },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
}

export async function updateAppointmentStatus(id, status) {
  await getAppointmentById(id);

  return prisma.appointment.update({
    where: { id },
    data: { status },
    include: { service: true },
  });
}
