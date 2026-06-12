import {
  listAppointments,
  getAppointment,
  updateAppointmentStatus,
} from '../controllers/appointmentsController.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import { validate } from '../middlewares/validate.js';
import { updateStatusSchema, appointmentsFilterSchema } from '../utils/schemas.js';

export async function adminAppointmentsRoutes(app) {
  app.addHook('preHandler', adminAuth);

  app.get(
    '/appointments',
    { preHandler: [validate(appointmentsFilterSchema, 'query')] },
    listAppointments
  );
  app.get('/appointments/:id', getAppointment);
  app.patch(
    '/appointments/:id/status',
    { preHandler: [validate(updateStatusSchema)] },
    updateAppointmentStatus
  );
}
