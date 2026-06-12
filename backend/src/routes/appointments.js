import {
  createAppointment,
  getAppointment,
  cancelAppointment,
} from '../controllers/appointmentsController.js';
import { validate } from '../middlewares/validate.js';
import { createAppointmentSchema } from '../utils/schemas.js';

export async function publicAppointmentsRoutes(app) {
  app.post(
    '/appointments',
    { preHandler: [validate(createAppointmentSchema)] },
    createAppointment
  );
  app.get('/appointments/:id', getAppointment);
  app.patch('/appointments/:id/cancel', cancelAppointment);
}
