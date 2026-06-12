import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export function errorHandler(error, request, reply) {
  // Errores de validación Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos de entrada inválidos',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  // Errores de negocio propios
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  // Errores inesperados
  request.log.error(error);
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
    },
  });
}
