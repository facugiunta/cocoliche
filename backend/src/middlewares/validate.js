/**
 * Crea un hook preHandler que valida body, query o params con un schema Zod.
 * Lanza ZodError si la validación falla — el errorHandler global lo captura.
 */
export function validate(schema, source = 'body') {
  return async (request) => {
    request[source] = schema.parse(request[source]);
  };
}
