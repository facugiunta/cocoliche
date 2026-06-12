import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { errorHandler } from './middlewares/errorHandler.js';
import { publicServicesRoutes } from './routes/services.js';
import { publicAvailabilityRoutes } from './routes/availability.js';
import { publicAppointmentsRoutes } from './routes/appointments.js';
import { adminAppointmentsRoutes } from './routes/adminAppointments.js';
import { adminServicesRoutes } from './routes/adminServices.js';
import { adminAvailabilityRoutes } from './routes/adminAvailability.js';

const app = Fastify({
  logger: process.env.NODE_ENV !== 'test',
});

// CORS — permite todos los orígenes y métodos
await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-key'],
});

// Error handler global
app.setErrorHandler(errorHandler);

// Rutas públicas
app.register(publicServicesRoutes, { prefix: '/api' });
app.register(publicAvailabilityRoutes, { prefix: '/api' });
app.register(publicAppointmentsRoutes, { prefix: '/api' });

// Rutas admin
app.register(adminAppointmentsRoutes, { prefix: '/admin' });
app.register(adminServicesRoutes, { prefix: '/admin' });
app.register(adminAvailabilityRoutes, { prefix: '/admin' });

// Health check
app.get('/health', async () => ({ success: true, data: { status: 'ok' } }));

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
