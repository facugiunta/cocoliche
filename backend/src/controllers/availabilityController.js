import * as availabilityService from '../services/availabilityService.js';

export async function getAvailableSlots(request, reply) {
  const { serviceId } = request.params;
  const { date } = request.query;
  const data = await availabilityService.getAvailableSlots(serviceId, date);
  return reply.send({ success: true, data });
}

export async function createAvailability(request, reply) {
  const data = await availabilityService.createAvailability(request.body);
  return reply.status(201).send({ success: true, data });
}

export async function deleteAvailability(request, reply) {
  await availabilityService.deleteAvailability(request.params.id);
  return reply.send({ success: true, data: null });
}
