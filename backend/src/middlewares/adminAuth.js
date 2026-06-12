import { AppError } from '../utils/AppError.js';

export async function adminAuth(request, reply) {
  const adminKey = request.headers['x-admin-key'];

  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    throw new AppError('UNAUTHORIZED', 'Acceso no autorizado', 401);
  }
}
