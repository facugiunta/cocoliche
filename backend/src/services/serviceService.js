import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/AppError.js';

export async function listActiveServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function getServiceById(id) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new AppError('NOT_FOUND', 'Servicio no encontrado', 404);
  return service;
}

export async function createService(data) {
  return prisma.service.create({ data });
}

export async function updateService(id, data) {
  await getServiceById(id);
  return prisma.service.update({ where: { id }, data });
}

export async function deactivateService(id) {
  await getServiceById(id);
  return prisma.service.update({
    where: { id },
    data: { isActive: false },
  });
}
