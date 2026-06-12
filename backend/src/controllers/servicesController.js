import * as serviceService from '../services/serviceService.js';

export async function listServices(request, reply) {
  const data = await serviceService.listActiveServices();
  return reply.send({ success: true, data });
}

export async function getService(request, reply) {
  const data = await serviceService.getServiceById(request.params.id);
  return reply.send({ success: true, data });
}

export async function createService(request, reply) {
  const data = await serviceService.createService(request.body);
  return reply.status(201).send({ success: true, data });
}

export async function updateService(request, reply) {
  const data = await serviceService.updateService(request.params.id, request.body);
  return reply.send({ success: true, data });
}

export async function deleteService(request, reply) {
  const data = await serviceService.deactivateService(request.params.id);
  return reply.send({ success: true, data });
}
