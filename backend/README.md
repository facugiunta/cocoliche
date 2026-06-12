# Appointments Backend

API REST para gestión de turnos/reservas. Stack: Node.js + Fastify + PostgreSQL + Prisma.

---

## Instalación local

```bash
cd backend
npm install
cp .env.example .env
# Completar las variables en .env

npm run db:migrate
npm run db:seed
npm run dev
```

---

## Deploy en Railway

### 1. Crear el proyecto

1. Ir a [railway.app](https://railway.app) y crear una cuenta / iniciar sesión
2. Crear un **New Project** → **Deploy from GitHub repo**
3. Conectar el repositorio y seleccionar la carpeta `/backend` como root directory
   (En Railway: Settings → Source → Root Directory → `backend`)

### 2. Agregar PostgreSQL

1. En el dashboard del proyecto, click en **New Service** → **Database** → **PostgreSQL**
2. Railway crea la base de datos y expone automáticamente la variable `DATABASE_URL`

### 3. Configurar variables de entorno

En Railway → tu servicio → **Variables**, agregar:

| Variable       | Valor                              |
|----------------|------------------------------------|
| `DATABASE_URL` | Se completa automáticamente por Railway al linkear el servicio Postgres |
| `PORT`         | `3000`                             |
| `ADMIN_SECRET` | Una clave secreta fuerte           |
| `NODE_ENV`     | `production`                       |

Para linkear el Postgres: en el servicio → Variables → **Add Variable Reference** → seleccionar `DATABASE_URL` de la base de datos.

### 4. Configurar el comando de start

En Railway → Settings → Deploy:
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`

### 5. Correr las migraciones en producción

Opción A — desde Railway CLI:
```bash
railway run npx prisma migrate deploy
```

Opción B — en el panel de Railway, agregar un servicio de run-once con comando:
```
npx prisma migrate deploy
```

---

## Estructura del proyecto

```
backend/
├── src/
│   ├── routes/           # Definición de endpoints
│   ├── controllers/      # Handlers de cada ruta (máx. 20 líneas)
│   ├── services/         # Lógica de negocio
│   ├── middlewares/      # Auth admin, validación Zod, error handler
│   ├── utils/            # AppError, schemas Zod, helpers de slots, Prisma client
│   └── server.js         # Entry point
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── .env.example
└── package.json
```

---

## Endpoints

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/services` | Listar servicios activos |
| GET | `/api/services/:id` | Detalle de un servicio |
| GET | `/api/availability/:serviceId?date=YYYY-MM-DD` | Slots disponibles para una fecha |
| POST | `/api/appointments` | Crear un turno |
| GET | `/api/appointments/:id` | Consultar estado de un turno |
| PATCH | `/api/appointments/:id/cancel` | Cancelar un turno |

### Admin (requieren header `x-admin-key: <ADMIN_SECRET>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/admin/appointments` | Listar todos los turnos (filtros: `date`, `status`, `serviceId`) |
| GET | `/admin/appointments/:id` | Detalle de un turno |
| PATCH | `/admin/appointments/:id/status` | Cambiar status (CONFIRMED / CANCELLED) |
| POST | `/admin/services` | Crear un servicio |
| PATCH | `/admin/services/:id` | Editar un servicio |
| DELETE | `/admin/services/:id` | Desactivar un servicio |
| POST | `/admin/availability` | Configurar horarios disponibles |
| DELETE | `/admin/availability/:id` | Eliminar un horario |

---

## Ejemplos curl

### Listar servicios
```bash
curl http://localhost:3000/api/services
```

### Ver slots disponibles
```bash
curl "http://localhost:3000/api/availability/<serviceId>?date=2026-06-16"
```

### Crear turno
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "<uuid>",
    "clientName": "Juan Pérez",
    "clientEmail": "juan@email.com",
    "clientPhone": "+541112345678",
    "date": "2026-06-16",
    "startTime": "09:00",
    "endTime": "09:30"
  }'
```

### Cancelar turno
```bash
curl -X PATCH http://localhost:3000/api/appointments/<id>/cancel
```

### Listar turnos (admin)
```bash
curl http://localhost:3000/admin/appointments?status=PENDING \
  -H "x-admin-key: tu_clave_secreta_aqui"
```

### Confirmar turno (admin)
```bash
curl -X PATCH http://localhost:3000/admin/appointments/<id>/status \
  -H "Content-Type: application/json" \
  -H "x-admin-key: tu_clave_secreta_aqui" \
  -d '{"status": "CONFIRMED"}'
```

### Crear servicio (admin)
```bash
curl -X POST http://localhost:3000/admin/services \
  -H "Content-Type: application/json" \
  -H "x-admin-key: tu_clave_secreta_aqui" \
  -d '{
    "name": "Consulta Premium",
    "description": "Consulta con especialista",
    "duration": 45
  }'
```

### Configurar disponibilidad (admin)
```bash
curl -X POST http://localhost:3000/admin/availability \
  -H "Content-Type: application/json" \
  -H "x-admin-key: tu_clave_secreta_aqui" \
  -d '{
    "serviceId": "<uuid>",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "18:00"
  }'
```

---

## Formato de respuestas

### Éxito
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_CONFLICT",
    "message": "El horario seleccionado ya no está disponible"
  }
}
```

### Códigos de error

| Código | HTTP | Descripción |
|--------|------|-------------|
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `VALIDATION_ERROR` | 400 | Datos de entrada inválidos |
| `APPOINTMENT_CONFLICT` | 409 | Horario ya ocupado |
| `UNAUTHORIZED` | 401 | Clave admin inválida |
| `SERVICE_INACTIVE` | 400 | El servicio no está activo |
| `INVALID_DATE` | 400 | Fecha en el pasado o formato inválido |
