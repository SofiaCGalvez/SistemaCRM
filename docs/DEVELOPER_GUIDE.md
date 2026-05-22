# Guia tecnica y de desarrollo

Esta guia ayuda a instalar, ejecutar, mantener y extender el proyecto.

## Arquitectura general

El proyecto esta dividido en dos aplicaciones:

- `BackEnd/`: API REST con Express, Sequelize y MySQL.
- `FrontEnd/`: interfaz estatica con HTML, JavaScript y Tailwind CSS.

El frontend consume el backend usando `window.API_BASE_URL`, definido en:

```text
FrontEnd/config.js
```

## Backend

Archivos principales:

```text
BackEnd/app.js
BackEnd/server.js
```

Responsabilidades de `BackEnd/app.js`:

- Cargar variables de entorno.
- Configurar seguridad con `helmet`.
- Configurar CORS.
- Configurar cookies.
- Configurar rate limit para login.
- Registrar rutas de API.

Responsabilidades de `BackEnd/server.js`:

- Conectar con MySQL usando Sequelize.
- Sincronizar modelos.
- Iniciar el servidor.

## Frontend

El frontend esta organizado por modulos. Cada modulo tiene su archivo HTML y, cuando aplica, su archivo JavaScript.

Ejemplos:

```text
FrontEnd/directorio/directorio.html
FrontEnd/directorio/directorio.js
FrontEnd/events/events.html
FrontEnd/events/events.js
FrontEnd/tasks/tasks.html
FrontEnd/tasks/tasks.js
```

El control de acceso del lado cliente esta en:

```text
FrontEnd/authGuard.js
```

Este archivo revisa:

- Si existe token en `localStorage`.
- Si existe usuario guardado.
- Si el rol del usuario puede acceder a la pagina actual.
- Que opciones del menu deben ocultarse para `staff`.

## Variables de entorno

El backend usa un archivo:

```text
BackEnd/.env
```

Hay una plantilla segura disponible en:

```text
BackEnd/.env.example
```

Variables principales:

| Variable | Descripcion |
| --- | --- |
| `PORT` | Puerto del backend. |
| `DB_HOST` | Host de MySQL. |
| `DB_PORT` | Puerto de MySQL. |
| `DB_NAME` | Nombre de la base de datos. |
| `DB_USER` | Usuario de MySQL. |
| `DB_PASSWORD` | Contrasena de MySQL. |
| `DB_SSL` | Activa SSL para la conexion a base de datos. |
| `DB_SSL_CA` | Certificado CA si el proveedor lo requiere. |
| `DB_SSL_REJECT_UNAUTHORIZED` | Controla la validacion del certificado SSL. |
| `JWT_SECRET` | Llave privada para firmar tokens. |
| `JWT_EXPIRES_IN` | Duracion del token JWT. |
| `JWT_COOKIE_MAX_AGE_MS` | Duracion de la cookie en milisegundos. |
| `FRONTEND_URL` | Origen permitido del frontend. |
| `FRONTEND_URLS` | Lista de origenes permitidos separados por coma. |
| `COOKIE_SAME_SITE` | Politica SameSite de la cookie. |
| `COOKIE_SECURE` | Indica si la cookie requiere HTTPS. |
| `AUTH_RATE_LIMIT` | Intentos permitidos en login por ventana de tiempo. |

## Instalacion local

### Backend

```bash
cd BackEnd
npm install
npm run dev
```

### Frontend

```bash
cd FrontEnd
npm install
npm run build
```

Para observar cambios de Tailwind:

```bash
npm run dev
```

## Base de datos

El proyecto usa Sequelize. La conexion esta en:

```text
BackEnd/config/database.js
```

Los modelos estan en:

```text
BackEnd/models/
```

Al iniciar el backend se ejecuta:

```js
sequelize.sync()
```

Esto sincroniza las tablas definidas por los modelos con la base de datos configurada.

## Crear usuarios iniciales

Ejecuta:

```bash
cd BackEnd
npm run seed:users
```

Esto crea usuarios de prueba:

| Rol | Email | Password |
| --- | --- | --- |
| admin | admin@test.com | 123456 |
| staff | staff@test.com | 123456 |

En produccion se deben cambiar estas credenciales.

## Convenciones del backend

Cada modulo CRUD sigue una estructura similar:

```text
routes -> controllers -> models -> database
```

Ejemplo con tareas:

- Ruta: `BackEnd/routes/taskRoutes.js`
- Controlador: `BackEnd/controllers/taskController.js`
- Modelo: `BackEnd/models/Task.js`

Los controladores suelen tener:

- Una funcion para normalizar datos.
- Una funcion para validar datos.
- Acciones CRUD.
- Manejo de errores con respuestas JSON.

## Agregar un nuevo modulo

Pasos recomendados:

1. Crear el modelo en `BackEnd/models/`.
2. Crear el controlador en `BackEnd/controllers/`.
3. Crear las rutas en `BackEnd/routes/`.
4. Registrar la ruta en `BackEnd/app.js`.
5. Crear pantalla HTML en `FrontEnd/`.
6. Crear archivo JS del modulo si necesita consumir API.
7. Agregar el enlace al menu.
8. Actualizar permisos en `FrontEnd/authGuard.js`.
9. Documentar el nuevo modulo en `README.md`, `docs/API.md` y `docs/USER_GUIDE.md`.

## Seguridad

El proyecto incluye varias medidas basicas:

- `helmet` para headers de seguridad.
- CORS restringido a origenes permitidos.
- Cookies HTTP-only para el token.
- JWT para rutas protegidas.
- Middleware de roles con `authorizeRoles`.
- Rate limit para `/api/auth/login`.
- Limite de JSON a `100kb`.

Buenas practicas:

- Usar un `JWT_SECRET` largo y privado.
- No subir `.env`.
- Cambiar usuarios de prueba en produccion.
- Usar HTTPS en produccion.
- Configurar `COOKIE_SECURE=true` cuando se use HTTPS.
- Revisar dominios permitidos en `FRONTEND_URLS`.

## Solucion de problemas

### El frontend no conecta al backend

Revisa:

- Que el backend este ejecutandose.
- Que `FrontEnd/config.js` apunte a la URL correcta.
- Que el origen del frontend este permitido en `FRONTEND_URL` o `FRONTEND_URLS`.

### Error de base de datos

Revisa:

- Credenciales del `.env`.
- Que MySQL este activo.
- Que la base de datos exista.
- Si el proveedor requiere SSL, configurar `DB_SSL=true`.

### Login falla con credenciales correctas

Revisa:

- Que los usuarios iniciales existan.
- Que se haya ejecutado `npm run seed:users`.
- Que el rol seleccionado coincida con el usuario.
- Que `JWT_SECRET` este definido.

### Staff no ve algunos modulos

Es comportamiento esperado. El rol `staff` no tiene acceso a membresias, asistentes, renovaciones pendientes ni miembros potenciales.

## Checklist antes de entregar

- Backend inicia sin errores.
- Frontend apunta al backend correcto.
- Login funciona con `admin`.
- Login funciona con `staff`.
- CRUD de empresas funciona.
- CRUD de eventos funciona.
- CRUD de tareas funciona.
- Modulos exclusivos de `admin` no aparecen para `staff`.
- `.env` no esta versionado.
- README y documentos de `docs/` estan actualizados.
