# Presentación del proyecto: CRM Asociación

## 1. Resumen general

**CRM Asociación** es una aplicación web desarrollada para administrar la información operativa de una asociación. El sistema permite centralizar en un solo lugar la gestión de empresas, membresías, eventos, asistentes y tareas internas.

El objetivo principal del proyecto es facilitar el seguimiento de las actividades administrativas de una asociación mediante una plataforma privada, accesible desde el navegador y organizada por roles de usuario.

---

## 2. Problema que resuelve

Muchas asociaciones manejan su información en hojas de cálculo, documentos separados o procesos manuales. Esto puede provocar:

- Información duplicada o desactualizada.
- Dificultad para consultar empresas, eventos o membresías.
- Falta de control sobre qué usuario puede acceder a cada módulo.
- Seguimiento poco claro de tareas internas.
- Mayor riesgo de errores al administrar datos importantes.

Este CRM busca resolver esos problemas centralizando la información y controlando el acceso según el rol del usuario.

---

## 3. Solución propuesta

El proyecto propone un sistema CRM con:

| Área | Solución |
| --- | --- |
| Gestión de empresas | Directorio con datos de contacto, industria, representante y sitio web |
| Gestión de membresías | Registro de datos fiscales, cuotas, pagos y periodos |
| Gestión de eventos | Administración de eventos, fechas, ubicaciones y estados |
| Gestión de asistentes | Control de personas registradas a eventos |
| Gestión de tareas | Seguimiento de actividades internas por responsable, prioridad y estado |
| Seguridad | Login con JWT, cookies HTTP-only, roles y permisos |

---

## 4. Tecnologías utilizadas

### Backend

| Tecnología | Función dentro del proyecto |
| --- | --- |
| Node.js | Ejecuta el servidor |
| Express | Define la API REST y las rutas |
| Sequelize | Conecta los modelos con MySQL |
| MySQL | Almacena la información del sistema |
| JWT | Maneja la autenticación |
| bcryptjs | Protege las contraseñas mediante hash |
| cookie-parser | Permite trabajar con cookies |
| helmet | Agrega cabeceras básicas de seguridad |
| cors | Controla qué frontend puede consumir la API |
| express-rate-limit | Limita intentos de login |
| Jest | Ejecuta pruebas automatizadas |
| Supertest | Prueba endpoints HTTP |

### Frontend

| Tecnología | Función dentro del proyecto |
| --- | --- |
| HTML | Estructura de las vistas |
| JavaScript | Lógica del cliente y consumo de API |
| Tailwind CSS | Diseño visual de la interfaz |
| Remix Icon / Font Awesome | Iconografía del sistema |

---

## 5. Arquitectura del proyecto

El sistema está dividido en dos partes principales:

```text
BackEnd/   -> API REST con Express, Sequelize y MySQL
FrontEnd/  -> Interfaz web estática con HTML, JavaScript y Tailwind CSS
docs/      -> Documentación del proyecto
```

### Backend

El backend se encarga de:

- Recibir peticiones HTTP.
- Validar autenticación y permisos.
- Procesar operaciones CRUD.
- Comunicarse con la base de datos.
- Enviar respuestas JSON al frontend.

Archivos importantes:

| Archivo / carpeta | Función |
| --- | --- |
| `BackEnd/app.js` | Configura Express, middlewares y rutas |
| `BackEnd/server.js` | Conecta MySQL y levanta el servidor |
| `BackEnd/routes/` | Define las rutas de la API |
| `BackEnd/controllers/` | Contiene la lógica de cada módulo |
| `BackEnd/models/` | Define los modelos de Sequelize |
| `BackEnd/middleware/` | Contiene validaciones de autenticación y roles |
| `BackEnd/tests/` | Contiene pruebas automatizadas |

### Frontend

El frontend se encarga de:

- Mostrar las pantallas del sistema.
- Consumir los endpoints del backend.
- Guardar información básica de sesión en el cliente.
- Controlar visualmente el acceso a módulos según el rol.

Archivos importantes:

| Archivo / carpeta | Función |
| --- | --- |
| `FrontEnd/auth/` | Login del sistema |
| `FrontEnd/dashboard/` | Vista general |
| `FrontEnd/directorio/` | Gestión de empresas |
| `FrontEnd/memberships/` | Gestión de membresías |
| `FrontEnd/events/` | Gestión de eventos |
| `FrontEnd/attendees/` | Gestión de asistentes |
| `FrontEnd/tasks/` | Gestión de tareas |
| `FrontEnd/authGuard.js` | Protección de vistas por rol |
| `FrontEnd/config.js` | URL base del backend |

---

## 6. Roles y permisos

El sistema maneja dos roles principales:

| Rol | Descripción |
| --- | --- |
| `admin` | Tiene acceso completo a todos los módulos |
| `staff` | Tiene acceso operativo limitado |

Permisos principales:

| Módulo | Admin | Staff |
| --- | :---: | :---: |
| Dashboard | Sí | Sí |
| Directorio / Companies | Sí | Sí |
| Eventos | Sí | Sí |
| Tareas | Sí | Sí |
| Membresías | Sí | No |
| Asistentes | Sí | No |
| Renovaciones pendientes | Sí | No |
| Miembros potenciales | Sí | No |

Este control se aplica tanto en el backend como en el frontend.

---

## 7. Módulos principales

### Directorio / Companies

Permite registrar y consultar empresas relacionadas con la asociación.

Incluye información como:

- Nombre de empresa.
- Representante.
- Cargo.
- Email.
- Teléfono.
- Industria.
- Sitio web.
- Estado.

También permite buscar, filtrar y exportar datos a CSV.

### Memberships

Permite administrar membresías, datos fiscales y pagos.

Incluye:

- Año y mes.
- Tipo de cuenta.
- Fecha de facturación.
- RFC.
- Número de membresía.
- Cuotas en MXN o USD.
- Periodo de membresía.
- Fecha y método de pago.

### Events

Permite registrar y dar seguimiento a eventos.

Incluye:

- Título.
- Tipo.
- Estado.
- Fecha de inicio y fin.
- Ubicación.
- Descripción.

### Attendees

Permite registrar asistentes a eventos.

Incluye:

- Nombre.
- Email.
- Empresa.
- Evento relacionado.
- Estado de asistencia.

### Tasks

Permite dar seguimiento a actividades internas.

Incluye:

- Título.
- Responsable.
- Fecha límite.
- Estado.
- Prioridad.
- Relación con algún módulo o actividad.

---

## 8. Seguridad implementada

El proyecto incluye varias medidas básicas de seguridad:

| Medida | Descripción |
| --- | --- |
| JWT | Se genera un token al iniciar sesión |
| Cookie HTTP-only | El token también se guarda en una cookie más segura |
| bcryptjs | Las contraseñas se almacenan hasheadas |
| Roles | Cada usuario accede solo a los módulos permitidos |
| Helmet | Agrega cabeceras HTTP de seguridad |
| CORS | Restringe los orígenes permitidos |
| Rate limit | Limita intentos repetidos de login |
| Variables de entorno | Evita exponer datos sensibles en el código |

Un punto importante es que las rutas protegidas validan autenticación antes de permitir acceso a la información.

---

## 9. Base de datos y modelos

La base de datos utiliza MySQL y se comunica con el backend por medio de Sequelize.

Modelos principales:

| Modelo | Uso |
| --- | --- |
| `User` | Usuarios del sistema |
| `Directory` | Empresas del directorio |
| `Membership` | Membresías y pagos |
| `Event` | Eventos |
| `Attendee` | Asistentes |
| `Task` | Tareas internas |

Cada modelo representa una entidad importante del sistema y permite realizar operaciones CRUD.

---

## 10. API y endpoints

El backend funciona como una API REST.

Base URL local:

```text
http://localhost:3000
```

Endpoints principales:

| Área | Ruta base |
| --- | --- |
| Autenticación | `/api/auth` |
| Directorio | `/api/directory` |
| Membresías | `/api/memberships` |
| Eventos | `/api/events` |
| Asistentes | `/api/attendees` |
| Tareas | `/api/tasks` |
| Rutas protegidas | `/api/protected` |

Cada módulo CRUD utiliza métodos HTTP como:

```text
GET     -> Consultar
POST    -> Crear
PUT     -> Actualizar
DELETE  -> Eliminar
```

---

## 11. Pruebas automatizadas

El backend incluye una prueba inicial con Jest y Supertest.

Archivo:

```text
BackEnd/tests/health.test.js
```

Esta prueba valida que el endpoint principal responda correctamente:

```text
GET /
```

Resultado esperado:

```text
API funcionando
```

Comando para ejecutar pruebas:

```bash
cd BackEnd
npm test
```

Esto demuestra que el proyecto ya tiene una base para seguir agregando pruebas automatizadas.

---

## 12. Instalación resumida

### Backend

```bash
cd BackEnd
npm install
npm run dev
```

### Usuarios iniciales

```bash
npm run seed:users
```

Usuarios de prueba:

| Rol | Email | Password |
| --- | --- | --- |
| `admin` | `admin@test.com` | `123456` |
| `staff` | `staff@test.com` | `123456` |

### Frontend

```bash
cd FrontEnd
npm install
npm run build
```

Después se abre:

```text
FrontEnd/auth/login.html
```

---

## 13. Flujo recomendado para la demostración

Para presentar el proyecto, se puede seguir este flujo:

1. Mostrar el README y explicar brevemente el objetivo del CRM.
2. Iniciar el backend con `npm run dev`.
3. Abrir el frontend en la pantalla de login.
4. Iniciar sesión como `admin`.
5. Mostrar el dashboard o pantalla inicial.
6. Entrar al módulo de empresas y mostrar un CRUD.
7. Mostrar eventos, membresías, asistentes y tareas.
8. Cerrar sesión.
9. Iniciar sesión como `staff`.
10. Mostrar que el rol `staff` no tiene acceso a módulos administrativos.
11. Ejecutar `npm test` para mostrar la prueba automatizada.
12. Cerrar explicando seguridad, documentación y posibles mejoras futuras.

---

## 14. Puntos fuertes para comentar

- El proyecto está dividido en backend y frontend.
- Usa una API REST organizada por rutas, controladores y modelos.
- Implementa autenticación con JWT.
- Maneja roles y permisos.
- Usa MySQL con Sequelize.
- Tiene medidas de seguridad como Helmet, CORS y rate limit.
- Cuenta con documentación para usuario, API y desarrollo.
- Incluye una prueba automatizada inicial.
- Tiene una estructura preparada para crecer con nuevos módulos.

---

## 15. Mejoras futuras

Algunas mejoras que podrían implementarse después:

- Agregar más pruebas automatizadas.
- Crear reportes avanzados.
- Agregar filtros más completos en todos los módulos.
- Implementar recuperación de contraseña.
- Agregar carga de archivos o comprobantes.
- Crear un dashboard con gráficas.
- Agregar logs de actividad por usuario.
- Mejorar el despliegue con variables por ambiente.
- Implementar una versión multiempresa o multi-asociación.

---

## 16. Guion breve para exposición

Puedes explicar el proyecto con este guion:

> Este proyecto es un CRM para asociaciones. Su objetivo es centralizar la información de empresas, membresías, eventos, asistentes y tareas internas.
>
> El sistema está dividido en dos partes: un backend con Node.js, Express, Sequelize y MySQL, y un frontend estático desarrollado con HTML, JavaScript y Tailwind CSS.
>
> Implementé autenticación con JWT, cookies HTTP-only, roles de usuario y rutas protegidas. Existen dos roles principales: admin, que puede acceder a todos los módulos, y staff, que tiene permisos limitados para tareas operativas.
>
> El backend está organizado en rutas, controladores, modelos y middlewares. El frontend consume la API mediante una URL configurable y protege las vistas según el rol del usuario.
>
> También agregué documentación separada para usuarios, API y desarrolladores, además de una prueba automatizada inicial con Jest y Supertest para validar que la API responde correctamente.
>
> Como mejora futura, se podrían agregar más pruebas, reportes, recuperación de contraseña, gráficas y una versión multiempresa para usar el sistema con diferentes asociaciones.

---

## 17. Conclusión

El proyecto cumple con el objetivo de crear una aplicación full stack funcional para administrar información de una asociación.

Además de los módulos principales, incluye autenticación, roles, seguridad básica, documentación y pruebas iniciales. Esto lo convierte en una base sólida para seguir creciendo como producto o como sistema personalizado para diferentes organizaciones.

