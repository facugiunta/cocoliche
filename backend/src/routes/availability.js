import { getAvailableSlots } from '../controllers/availabilityController.js';
import { validate } from '../middlewares/validate.js';
import { availabilityQuerySchema } from '../utils/schemas.js';

export async function publicAvailabilityRoutes(app) {
  app.get(
    '/availability/:serviceId',
    { preHandler: [validate(availabilityQuerySchema, 'query')] },
    getAvailableSlots
  );
}
