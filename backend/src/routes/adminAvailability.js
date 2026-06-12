import {
  createAvailability,
  deleteAvailability,
} from '../controllers/availabilityController.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import { validate } from '../middlewares/validate.js';
import { createAvailabilitySchema } from '../utils/schemas.js';

export async function adminAvailabilityRoutes(app) {
  app.addHook('preHandler', adminAuth);

  app.post(
    '/availability',
    { preHandler: [validate(createAvailabilitySchema)] },
    createAvailability
  );
  app.delete('/availability/:id', deleteAvailability);
}
