import {
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import { validate } from '../middlewares/validate.js';
import { createServiceSchema, updateServiceSchema } from '../utils/schemas.js';

export async function adminServicesRoutes(app) {
  app.addHook('preHandler', adminAuth);

  app.post(
    '/services',
    { preHandler: [validate(createServiceSchema)] },
    createService
  );
  app.patch(
    '/services/:id',
    { preHandler: [validate(updateServiceSchema)] },
    updateService
  );
  app.delete('/services/:id', deleteService);
}
