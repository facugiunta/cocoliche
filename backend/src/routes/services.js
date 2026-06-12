import { listServices, getService } from '../controllers/servicesController.js';

export async function publicServicesRoutes(app) {
  app.get('/services', listServices);
  app.get('/services/:id', getService);
}
