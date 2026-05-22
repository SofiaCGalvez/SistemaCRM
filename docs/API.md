# Guia de API

Esta guia describe los endpoints principales del backend. Todas las rutas usan JSON y estan montadas sobre la URL base del servidor.

URL local por defecto:

```text
http://localhost:3000
```

## Autenticacion

El login genera un JWT. El backend lo envia en la respuesta y tambien lo guarda en una cookie HTTP-only llamada `crm_token`.

Las rutas protegidas aceptan el token de dos formas:

- Cookie `crm_token`.
- Header `Authorization: Bearer <token>`.

## Respuestas de error comunes

| Codigo | Significado |
| --- | --- |
| `400` | Datos incompletos o invalidos. |
| `401` | No hay token o sesion activa. |
| `403` | Token invalido, expirado o rol sin permiso. |
| `404` | Recurso no encontrado. |
| `500` | Error interno del servidor. |

## Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

Respuesta exitosa:

```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Sofia Admin",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

## Logout

```http
POST /api/auth/logout
```

Respuesta exitosa:

```json
{
  "message": "Logged out successfully"
}
```

## Rutas protegidas de prueba

| Metodo | Ruta | Roles permitidos |
| --- | --- | --- |
| `GET` | `/api/protected/dashboard` | admin, staff |
| `GET` | `/api/protected/directorio` | admin, staff |
| `GET` | `/api/protected/admin` | admin |

## Directory

Ruta base:

```text
/api/directory
```

Roles permitidos:

- admin
- staff

### Obtener registros

```http
GET /api/directory
```

### Crear registro

```http
POST /api/directory
```

Body:

```json
{
  "company": "Empresa Demo",
  "representative": "Maria Lopez",
  "position": "CEO",
  "email": "maria@empresa.com",
  "phone": "5551234567",
  "industry": "Technology",
  "website": "https://empresa.com",
  "status": "active"
}
```

Campos obligatorios:

- `company`
- `representative`
- `email`

### Actualizar registro

```http
PUT /api/directory/:id
```

### Eliminar registro

```http
DELETE /api/directory/:id
```

## Memberships

Ruta base:

```text
/api/memberships
```

Roles permitidos:

- admin

### Obtener membresias

```http
GET /api/memberships
```

### Crear membresia

```http
POST /api/memberships
```

Body minimo:

```json
{
  "year": 2026,
  "month": "May",
  "accountType": "MXN",
  "billingDate": "2026-05-20",
  "invoice": "FAC-001",
  "companyName": "Empresa Demo",
  "rfc": "RFC123456789",
  "feeMxn": 1000,
  "feeUsd": 0
}
```

Campos obligatorios:

- `year`
- `month`
- `accountType`
- `billingDate`
- `invoice`
- `companyName`
- `rfc`

Valores permitidos:

- `month`: `January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`
- `accountType`: `MXN`, `USD`

### Actualizar membresia

```http
PUT /api/memberships/:id
```

### Eliminar membresia

```http
DELETE /api/memberships/:id
```

## Events

Ruta base:

```text
/api/events
```

Roles permitidos:

- admin
- staff

### Obtener eventos

```http
GET /api/events
```

Filtros opcionales:

```http
GET /api/events?year=2026&month=5
```

### Crear evento

```http
POST /api/events
```

Body:

```json
{
  "title": "Networking mensual",
  "type": "networking",
  "status": "upcoming",
  "date": "2026-05-30",
  "endDate": "2026-05-30",
  "location": "Ciudad de Mexico",
  "description": "Evento para miembros de la asociacion"
}
```

Campos obligatorios:

- `title`
- `type`
- `status`
- `date`
- `location`

Valores permitidos:

- `type`: `conference`, `workshop`, `networking`, `summit`, `roundtable`, `expo`, `other`
- `status`: `upcoming`, `completed`, `cancelled`

### Actualizar evento

```http
PUT /api/events/:id
```

### Eliminar evento

```http
DELETE /api/events/:id
```

## Attendees

Ruta base:

```text
/api/attendees
```

Roles permitidos:

- admin

### Obtener asistentes

```http
GET /api/attendees
```

Filtros opcionales:

```http
GET /api/attendees?eventId=1&status=registered
```

### Crear asistente

```http
POST /api/attendees
```

Body:

```json
{
  "name": "Juan Perez",
  "email": "juan@correo.com",
  "company": "Empresa Demo",
  "eventId": "1",
  "eventName": "Networking mensual",
  "status": "registered"
}
```

Campos obligatorios:

- `name`
- `email`
- `company`
- `eventId`
- `eventName`

Valores permitidos para `status`:

- `registered`
- `attended`
- `no-show`

### Actualizar asistente

```http
PUT /api/attendees/:id
```

### Eliminar asistente

```http
DELETE /api/attendees/:id
```

## Tasks

Ruta base:

```text
/api/tasks
```

Roles permitidos:

- admin
- staff

### Obtener tareas

```http
GET /api/tasks
```

Filtros opcionales:

```http
GET /api/tasks?status=pending&priority=high&assignee=staff
```

Regla especial:

- Si el usuario es `staff`, el backend fuerza `assignee=staff`.

### Crear tarea

```http
POST /api/tasks
```

Body:

```json
{
  "title": "Dar seguimiento a empresa demo",
  "assignee": "staff",
  "dueDate": "2026-05-31",
  "status": "pending",
  "priority": "medium",
  "relatedTo": "Empresa Demo"
}
```

Campos obligatorios:

- `title`
- `assignee`
- `dueDate`
- `status`
- `priority`
- `relatedTo`

Valores permitidos:

- `assignee`: `admin`, `staff`
- `status`: `pending`, `in-progress`, `completed`
- `priority`: `high`, `medium`, `low`

### Actualizar tarea

```http
PUT /api/tasks/:id
```

### Eliminar tarea

```http
DELETE /api/tasks/:id
```

Regla especial:

- `staff` no puede modificar ni eliminar tareas asignadas a `admin`.
