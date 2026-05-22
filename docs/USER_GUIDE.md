# Guia de usuario

Esta guia explica como usar el CRM desde la interfaz web. El sistema esta pensado para administrar la informacion de una asociacion: empresas, membresias, eventos, asistentes y tareas.

## Acceso al sistema

1. Abre la pantalla de inicio de sesion:

```text
FrontEnd/auth/login.html
```

2. Selecciona el rol con el que vas a entrar: `admin` o `staff`.
3. Escribe el correo y la contrasena.
4. Presiona `Sign in`.

Si las credenciales son correctas, el sistema redirige al modulo inicial permitido para tu rol.

## Roles del sistema

### Admin

El usuario `admin` puede acceder a todos los modulos:

- Home
- Dashboard
- Companies
- Memberships
- Events
- Attendees
- Tasks
- Pending Renewals
- Potential Members

### Staff

El usuario `staff` tiene acceso operativo limitado:

- Dashboard
- Companies
- Events
- Tasks

Las opciones exclusivas de administrador no se muestran en el menu del usuario `staff`.

## Navegacion general

El menu lateral permite cambiar entre modulos. En pantallas pequenas se usa el boton de menu de la parte superior.

Para cerrar sesion:

1. Presiona `Log out`.
2. El sistema elimina la sesion local.
3. Se redirige a la pantalla de login.

## Modulo Home

Disponible para `admin`.

Muestra accesos rapidos a los modulos principales del CRM. Sirve como pantalla inicial para entrar rapidamente a dashboard, empresas, membresias, eventos, asistentes y tareas.

## Modulo Dashboard

Disponible para `admin` y `staff`.

Permite consultar una vista general del sistema. Es el punto de entrada principal para usuarios con rol `staff`.

## Modulo Companies

Disponible para `admin` y `staff`.

Se usa para administrar el directorio de empresas.

Acciones disponibles:

- Ver empresas registradas.
- Buscar empresas por nombre, representante, email, telefono o sitio web.
- Filtrar por industria.
- Crear una empresa.
- Editar una empresa existente.
- Eliminar una empresa.
- Exportar el listado a CSV.

Campos principales:

- Company
- Representative
- Position
- Email
- Phone
- Industry
- Website

## Modulo Memberships

Disponible para `admin`.

Se usa para registrar y administrar membresias, facturacion y pagos.

Campos principales:

- Year
- Month
- Account type
- Billing date
- Invoice
- Company name
- Legal name
- RFC
- Membership number
- Contactos
- Fee MXN
- Fee USD
- Periodo
- Payment date
- Payment method
- Receipt

## Modulo Events

Disponible para `admin` y `staff`.

Se usa para planear y administrar eventos.

Campos principales:

- Title
- Type
- Status
- Date
- End date
- Location
- Description

Tipos de evento:

- conference
- workshop
- networking
- summit
- roundtable
- expo
- other

Estados:

- upcoming
- completed
- cancelled

## Modulo Attendees

Disponible para `admin`.

Se usa para registrar asistentes a eventos.

Campos principales:

- Name
- Email
- Company
- Event ID
- Event name
- Status

Estados:

- registered
- attended
- no-show

## Modulo Tasks

Disponible para `admin` y `staff`.

Se usa para dar seguimiento a actividades internas.

Campos principales:

- Title
- Assignee
- Due date
- Status
- Priority
- Related to

Estados:

- pending
- in-progress
- completed

Prioridades:

- high
- medium
- low

Reglas importantes:

- `admin` puede crear, editar y eliminar tareas para `admin` o `staff`.
- `staff` solo trabaja con tareas asignadas a `staff`.

## Mensajes comunes

| Mensaje | Posible causa | Solucion |
| --- | --- | --- |
| `Could not connect to the server` | El backend no esta ejecutandose o la URL del API es incorrecta. | Inicia el backend y revisa `FrontEnd/config.js`. |
| `Invalid credentials` | Email, contrasena o rol incorrecto. | Verifica los datos e intenta de nuevo. |
| `Authentication required` | No hay sesion activa. | Inicia sesion nuevamente. |
| `You do not have permission` | El rol no tiene acceso a esa accion. | Usa un usuario con permisos adecuados. |

## Recomendaciones de uso

- Cierra sesion al terminar de trabajar.
- Evita compartir usuarios entre varias personas.
- Revisa los filtros antes de exportar datos.
- Mantiene actualizados los campos obligatorios para evitar errores de guardado.
