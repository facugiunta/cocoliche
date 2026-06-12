import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Limpiar datos existentes
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.service.deleteMany();

  // Crear servicios
  const generalConsult = await prisma.service.create({
    data: {
      name: 'Consulta General',
      description: 'Consulta médica estándar de 30 minutos',
      duration: 30,
      isActive: true,
    },
  });

  const extendedConsult = await prisma.service.create({
    data: {
      name: 'Consulta Extendida',
      description: 'Consulta médica detallada de 60 minutos',
      duration: 60,
      isActive: true,
    },
  });

  // Disponibilidad lunes a viernes (1-5) de 9:00 a 18:00 para cada servicio
  const weekdays = [1, 2, 3, 4, 5];

  for (const day of weekdays) {
    await prisma.availability.create({
      data: {
        serviceId: generalConsult.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    });

    await prisma.availability.create({
      data: {
        serviceId: extendedConsult.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
  }

  // Obtener próximo lunes para los turnos de ejemplo
  const today = new Date();
  const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);

  await prisma.appointment.createMany({
    data: [
      {
        serviceId: generalConsult.id,
        clientName: 'Juan Pérez',
        clientEmail: 'juan.perez@email.com',
        clientPhone: '+541112345678',
        date: nextMonday,
        startTime: '09:00',
        endTime: '09:30',
        status: 'CONFIRMED',
        notes: 'Primera visita',
      },
      {
        serviceId: extendedConsult.id,
        clientName: 'María García',
        clientEmail: 'maria.garcia@email.com',
        clientPhone: '+541187654321',
        date: nextMonday,
        startTime: '10:00',
        endTime: '11:00',
        status: 'PENDING',
        notes: null,
      },
      {
        serviceId: generalConsult.id,
        clientName: 'Carlos López',
        clientEmail: 'carlos.lopez@email.com',
        clientPhone: '+541199887766',
        date: nextMonday,
        startTime: '11:00',
        endTime: '11:30',
        status: 'CANCELLED',
        notes: 'Cancelado por el cliente',
      },
    ],
  });

  console.log('Seed completado exitosamente.');
  console.log(`  - Servicio: ${generalConsult.name} (${generalConsult.id})`);
  console.log(`  - Servicio: ${extendedConsult.name} (${extendedConsult.id})`);
  console.log(`  - 10 registros de disponibilidad creados (Lun-Vie para cada servicio)`);
  console.log(`  - 3 turnos de ejemplo creados para el próximo lunes`);
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
