import * as appointmentService from '../services/appointmentService.js';

export async function createAppointment(request, reply) {
  const data = await appointmentService.createAppointment(request.body);
  return reply.status(201).send({ success: true, data });
}

export async function getAppointment(request, reply) {
  const data = await appointmentService.getAppointmentById(request.params.id);
  return reply.send({ success: true, data });
}

export async function cancelAppointment(request, reply) {
  const data = await appointmentService.cancelAppointment(request.params.id);
  return reply.send({ success: true, data });
}

export async function listAppointments(request, reply) {
  const data = await appointmentService.listAllAppointments(request.query);
  return reply.send({ success: true, data });
}

export async function updateAppointmentStatus(request, reply) {
  const { status } = request.body;
  const data = await appointmentService.updateAppointmentStatus(request.params.id, status);
  return reply.send({ success: true, data });
}
