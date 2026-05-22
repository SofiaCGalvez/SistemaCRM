# 🏢 CRM Asociación

Sistema CRM para gestionar la información operativa de una asociación: empresas del directorio, membresías, eventos, asistentes y tareas internas.

El proyecto está dividido en un **backend con Express, Sequelize y MySQL** y un **frontend estático con HTML, JavaScript y Tailwind CSS**.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize">
  <img src="https://img.shields.io/badge/TailwindCSS-Frontend-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-En%20desarrollo-blue?style=flat-square" alt="Estado">
  <img src="https://img.shields.io/badge/Proyecto-CRM%20Asociación-purple?style=flat-square" alt="Proyecto">
  <img src="https://img.shields.io/badge/Roles-Admin%20%7C%20Staff-orange?style=flat-square" alt="Roles">
  <img src="https://img.shields.io/badge/Auth-JWT%20%2B%20Cookies-green?style=flat-square" alt="Auth">
</p>

---

## 📌 Tabla de contenido

- [Descripción general](#-descripción-general)
- [Características principales](#-características-principales)
- [Módulos del sistema](#-módulos-del-sistema)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y configuración](#-instalación-y-configuración)
- [Variables de entorno](#-variables-de-entorno)
- [Usuarios iniciales](#-usuarios-iniciales)
- [Roles y permisos](#-roles-y-permisos)
- [Endpoints principales](#-endpoints-principales)
- [Modelos principales](#-modelos-principales)
- [Scripts disponibles](#-scripts-disponibles)
- [Pruebas automatizadas](#-pruebas-automatizadas)
- [Flujo recomendado de uso](#-flujo-recomendado-de-uso)
- [Notas de despliegue](#-notas-de-despliegue)
- [Documentación adicional](#-documentación-adicional)

---

## 🧭 Descripción general

**CRM Asociación** es una aplicación web diseñada para centralizar la administración de una asociación. Permite organizar empresas, controlar membresías, registrar eventos, administrar asistentes y dar seguimiento a tareas internas.

El sistema contempla dos tipos de usuario:

| Rol | Enfoque | Acceso |
| --- | --- | --- |
| 👑 `admin` | Administración completa del CRM | Todos los módulos |
| 🧑‍💼 `staff` | Operación diaria y seguimiento | Módulos operativos |

---

## ✨ Características principales

| Categoría | Funcionalidad | Estado |
| --- | --- | :---: |
| 🔐 Autenticación | Inicio de sesión con JWT | ✅ |
| 🍪 Sesión segura | Cookie HTTP-only y token en cliente | ✅ |
| 👥 Roles | Control de acceso para `admin` y `staff` | ✅ |
| 🏢 Directorio | CRUD de empresas | ✅ |
| 💳 Membresías | Registro y control de membresías | ✅ |
| 📅 Eventos | Gestión de eventos | ✅ |
| 🎟️ Asistentes | Registro de asistentes a eventos | ✅ |
| ✅ Tareas | Seguimiento de actividades internas | ✅ |
| 🛡️ Seguridad | Helmet, CORS y rate limit para login | ✅ |
| 🎨 Estilos | Interfaz con Tailwind CSS | ✅ |
| 📤 Exportación | Exportación de empresas a CSV | ✅ |

---

## 🧩 Módulos del sistema

| Módulo | Descripción | Roles |
| --- | --- | --- |
| 🏠 Home | Accesos rápidos a secciones principales | `admin` |
| 📊 Dashboard | Vista general del sistema | `admin`, `staff` |
| 🏢 Companies / Directorio | Administración de empresas | `admin`, `staff` |
| 💳 Memberships | Gestión de membresías, pagos y facturación | `admin` |
| 📅 Events | Registro y administración de eventos | `admin`, `staff` |
| 🎟️ Attendees | Control de asistentes a eventos | `admin` |
| ✅ Tasks | Administración de tareas internas | `admin`, `staff` |
| 🔄 Pending Renewals | Seguimiento de renovaciones pendientes | `admin` |
| 🌱 Potential Members | Seguimiento de miembros potenciales | `admin` |

---

## 🧰 Tecnologías utilizadas

### Backend

| Tecnología | Uso |
| --- | --- |
| Node.js | Entorno de ejecución |
| Express | Servidor y rutas HTTP |
| Sequelize | ORM para modelos y consultas |
| MySQL | Base de datos relacional |
| JSON Web Token | Autenticación |
| bcryptjs | Hash de contraseñas |
| cookie-parser | Manejo de cookies |
| helmet | Cabeceras básicas de seguridad |
| express-rate-limit | Límite de intentos en login |
| cors | Configuración de acceso entre dominios |
| Jest | Pruebas automatizadas |
| Supertest | Pruebas HTTP de la API |

### Frontend

| Tecnología | Uso |
| --- | --- |
| HTML | Estructura de páginas |
| JavaScript | Lógica del cliente y consumo de API |
| Tailwind CSS | Estilos de la interfaz |
| Remix Icon | Iconografía |
| Font Awesome | Iconografía complementaria |

---

## 📁 Estructura del proyecto

```text
.
+-- BackEnd/
|   +-- app.js
|   +-- config/
|   +-- controllers/
|   +-- middleware/
|   +-- models/
|   +-- routes/
|   +-- seeders/
|   +-- tests/
|   +-- server.js
|   +-- package.json
+-- FrontEnd/
|   +-- auth/
|   +-- attendees/
|   +-- dashboard/
|   +-- directorio/
|   +-- events/
|   +-- memberships/
|   +-- tasks/
|   +-- dist/
|   +-- images/
|   +-- src/
|   +-- app.js
|   +-- authGuard.js
|   +-- config.js
|   +-- index.html
|   +-- package.json
+-- docs/
|   +-- API.md
|   +-- DEVELOPER_GUIDE.md
|   +-- USER_GUIDE.md
+-- README.md
```

---

## ✅ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

| Requisito | Descripción |
| --- | --- |
| Node.js | Para ejecutar backend y herramientas del frontend |
| npm | Para instalar dependencias |
| MySQL | Base de datos del sistema |
| Live Server o servidor estático | Para abrir el frontend en desarrollo |
| Navegador web | Para usar la interfaz |

También debes tener creada una base de datos para el proyecto.

Ejemplo:

```sql
CREATE DATABASE crm_asociacion;
```

---

## 🚀 Instalación y configuración

### 1. Configurar backend

Entra a la carpeta del backend:

```bash
cd BackEnd
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` dentro de `BackEnd/`.

Puedes tomar como base:

```text
BackEnd/.env.example
```

Ejemplo de configuración:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=crm_asociacion
DB_USER=root
DB_PASSWORD=tu_password
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true

JWT_SECRET=un_valor_largo_y_seguro_de_al_menos_32_caracteres
JWT_EXPIRES_IN=2h
JWT_COOKIE_MAX_AGE_MS=7200000

FRONTEND_URL=http://127.0.0.1:5500
FRONTEND_URLS=http://localhost:5500,http://127.0.0.1:5500

COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
AUTH_RATE_LIMIT=10
```

> ⚠️ No subas el archivo `.env` al repositorio. Este archivo debe contener valores privados y ya está incluido en `.gitignore`.

Ejecuta el servidor en modo desarrollo:

```bash
npm run dev
```

También puedes iniciar el backend con:

```bash
npm start
```

Por defecto, el backend queda disponible en:

```text
http://localhost:3000
```

---

### 2. Crear usuarios iniciales

El proyecto incluye un seeder para crear usuarios de prueba.

Desde la carpeta `BackEnd/` ejecuta:

```bash
npm run seed:users
```

Usuarios creados:

| Rol | Email | Password | Uso recomendado |
| --- | --- | --- | --- |
| 👑 `admin` | `admin@test.com` | `123456` | Probar todos los módulos |
| 🧑‍💼 `staff` | `staff@test.com` | `123456` | Probar permisos limitados |

> ⚠️ Estos usuarios son solo para desarrollo. Cambia las credenciales antes de usar el sistema en producción.

---

### 3. Configurar frontend

Entra a la carpeta del frontend:

```bash
cd FrontEnd
```

Instala las dependencias:

```bash
npm install
```

Genera el CSS de Tailwind:

```bash
npm run build
```

Para trabajar con Tailwind en modo observador:

```bash
npm run dev
```

Configura la URL del backend en:

```text
FrontEnd/config.js
```

Para desarrollo local:

```js
window.API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";
```

Actualmente el archivo apunta a:

```js
window.API_BASE_URL = window.API_BASE_URL || "https://sistemacrm-i9pi.onrender.com";
```

Abre la pantalla de login con un servidor estático, por ejemplo Live Server de VS Code:

```text
FrontEnd/auth/login.html
```

---

## 🔐 Variables de entorno

| Variable | Ejemplo | Descripción |
| --- | --- | --- |
| `PORT` | `3000` | Puerto donde corre el backend |
| `DB_HOST` | `localhost` | Host de MySQL |
| `DB_PORT` | `3306` | Puerto de MySQL |
| `DB_NAME` | `crm_asociacion` | Nombre de la base de datos |
| `DB_USER` | `root` | Usuario de MySQL |
| `DB_PASSWORD` | `tu_password` | Contraseña de MySQL |
| `DB_SSL` | `false` | Activa conexión SSL con la base de datos |
| `DB_SSL_REJECT_UNAUTHORIZED` | `true` | Valida certificados SSL |
| `JWT_SECRET` | `valor_largo_seguro` | Clave privada para firmar tokens |
| `JWT_EXPIRES_IN` | `2h` | Duración del token JWT |
| `JWT_COOKIE_MAX_AGE_MS` | `7200000` | Duración de la cookie en milisegundos |
| `FRONTEND_URL` | `http://127.0.0.1:5500` | URL principal permitida del frontend |
| `FRONTEND_URLS` | `http://localhost:5500,http://127.0.0.1:5500` | Lista de URLs permitidas para CORS |
| `COOKIE_SAME_SITE` | `lax` | Política SameSite de cookies |
| `COOKIE_SECURE` | `false` | Define si la cookie requiere HTTPS |
| `AUTH_RATE_LIMIT` | `10` | Límite de intentos para login |

---

## 👤 Usuarios iniciales

| Rol | Email | Password | Permisos |
| --- | --- | --- | --- |
| 👑 `admin` | `admin@test.com` | `123456` | Acceso completo |
| 🧑‍💼 `staff` | `staff@test.com` | `123456` | Acceso operativo |

---

## 🔑 Roles y permisos

| Módulo | Admin | Staff |
| --- | :---: | :---: |
| 🏠 Home | ✅ | ❌ |
| 📊 Dashboard | ✅ | ✅ |
| 🏢 Directorio / Companies | ✅ | ✅ |
| 📅 Eventos | ✅ | ✅ |
| ✅ Tareas | ✅ | ✅ |
| 💳 Membresías | ✅ | ❌ |
| 🎟️ Asistentes | ✅ | ❌ |
| 🔄 Renovaciones pendientes | ✅ | ❌ |
| 🌱 Miembros potenciales | ✅ | ❌ |

---

## 🌐 Endpoints principales

Base URL local:

```text
http://localhost:3000
```

### Autenticación

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Inicia sesión |
| `POST` | `/api/auth/logout` | Cierra sesión |

### Rutas protegidas

| Método | Ruta | Roles |
| --- | --- | --- |
| `GET` | `/api/protected/dashboard` | `admin`, `staff` |
| `GET` | `/api/protected/directorio` | `admin`, `staff` |
| `GET` | `/api/protected/admin` | `admin` |

### Módulos CRUD

| Recurso | Ruta base | Roles |
| --- | --- | --- |
| 🎟️ Asistentes | `/api/attendees` | `admin` |
| 🏢 Directorio | `/api/directory` | `admin`, `staff` |
| 📅 Eventos | `/api/events` | `admin`, `staff` |
| 💳 Membresías | `/api/memberships` | `admin` |
| ✅ Tareas | `/api/tasks` | `admin`, `staff` |

Cada recurso CRUD usa la estructura general:

```text
GET     /api/recurso
POST    /api/recurso
PUT     /api/recurso/:id
DELETE  /api/recurso/:id
```

Para más detalle sobre cuerpos JSON, respuestas y permisos, revisa:

```text
docs/API.md
```

---

## 🗃️ Modelos principales

| Modelo | Descripción | Campos principales |
| --- | --- | --- |
| `User` | Usuarios del sistema | nombre, email, password, rol |
| `Directory` | Empresas del directorio | empresa, representante, cargo, email, teléfono, industria, sitio web, estado |
| `Membership` | Membresías y pagos | datos fiscales, contactos, cuotas, fechas de pago, periodo |
| `Event` | Eventos de la asociación | título, tipo, estado, fecha, ubicación, descripción |
| `Attendee` | Asistentes a eventos | nombre, email, empresa, evento, estado |
| `Task` | Tareas internas | título, responsable, fecha límite, estado, prioridad, relación |

---

## 📜 Scripts disponibles

### Backend

Ubicación:

```bash
cd BackEnd
```

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor con Node |
| `npm run dev` | Inicia el servidor con Nodemon |
| `npm run seed:users` | Crea usuarios iniciales de prueba |
| `npm test` | Ejecuta las pruebas automatizadas con Jest |

### Frontend

Ubicación:

```bash
cd FrontEnd
```

| Comando | Descripción |
| --- | --- |
| `npm run build` | Genera `dist/output.css` con Tailwind CSS |
| `npm run dev` | Genera CSS en modo watch |
| `npm test` | Script de prueba no configurado en frontend |

---

## 🧪 Pruebas automatizadas

El backend tiene una prueba inicial configurada con **Jest** y **Supertest**.

| Archivo | Qué valida |
| --- | --- |
| `BackEnd/tests/health.test.js` | Comprueba que `GET /` responda `API funcionando` |

Para ejecutar las pruebas:

```bash
cd BackEnd
npm test
```

Resultado esperado:

```text
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

---

## 🧪 Flujo recomendado de uso

1. Inicia MySQL.
2. Confirma que exista la base de datos `crm_asociacion`.
3. Configura `BackEnd/.env`.
4. Instala dependencias del backend con `npm install`.
5. Ejecuta el backend con `npm run dev`.
6. Ejecuta `npm run seed:users` si necesitas usuarios de prueba.
7. Instala dependencias del frontend con `npm install`.
8. Genera los estilos con `npm run build`.
9. Ajusta `FrontEnd/config.js` para apuntar al backend correcto.
10. Abre `FrontEnd/auth/login.html` con Live Server.
11. Inicia sesión como `admin` o `staff`.
12. Prueba los permisos entrando a los módulos permitidos para cada rol.

---

## 🧯 Mensajes comunes

| Mensaje | Posible causa | Solución |
| --- | --- | --- |
| `Could not connect to the server` | El backend no está ejecutándose o la URL del API es incorrecta | Inicia el backend y revisa `FrontEnd/config.js` |
| `Invalid credentials` | Email, contraseña o rol incorrecto | Verifica los datos e intenta de nuevo |
| `Authentication required` | No hay sesión activa | Inicia sesión nuevamente |
| `You do not have permission` | El rol no tiene acceso a esa acción | Usa un usuario con permisos adecuados |

---

## 🛡️ Seguridad

El proyecto incluye medidas básicas de seguridad para desarrollo y despliegue:

| Medida | Descripción |
| --- | --- |
| JWT | Tokens para autenticación |
| Cookie HTTP-only | Reduce exposición del token en cliente |
| bcryptjs | Contraseñas hasheadas |
| helmet | Cabeceras HTTP de seguridad |
| CORS configurable | Control de dominios permitidos |
| Rate limit | Límite de intentos en login |
| Variables `.env` | Separación de configuración sensible |

> 🔒 En producción usa siempre un `JWT_SECRET` largo, privado y diferente al de desarrollo.

---

## 🚀 Notas de despliegue

Antes de desplegar, revisa:

| Tema | Recomendación |
| --- | --- |
| Base de datos | Usa credenciales seguras y activa SSL si el proveedor lo requiere |
| JWT | Configura un `JWT_SECRET` largo y privado |
| CORS | Define `FRONTEND_URL` o `FRONTEND_URLS` con los dominios reales |
| Cookies | Ajusta `COOKIE_SAME_SITE` y `COOKIE_SECURE` según el dominio y HTTPS |
| Frontend | Verifica que `FrontEnd/config.js` apunte al backend desplegado |
| Usuarios iniciales | Cambia o elimina las credenciales de prueba |
| Sequelize | El backend sincroniza modelos con `sequelize.sync()` al iniciar |

Configuración común en producción:

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

> ⚠️ Si frontend y backend están en dominios diferentes, revisa cuidadosamente la configuración de cookies, CORS y HTTPS.

---

## 📚 Documentación adicional

La documentación del proyecto está organizada en archivos separados:

| Documento | Descripción |
| --- | --- |
| 📘 [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) | Guía para usuarios finales: login, roles, módulos y acciones principales |
| 🧾 [`docs/API.md`](docs/API.md) | Endpoints, autenticación, permisos, cuerpos JSON y respuestas |
| 🛠️ [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) | Guía técnica para instalación, mantenimiento, seguridad y extensión |
| 🎤 [`docs/PRESENTACION_PROYECTO.md`](docs/PRESENTACION_PROYECTO.md) | Resumen del proyecto y guion de apoyo para exposición |

---

## 🧑‍💻 Resumen rápido para evaluación

| Punto | Detalle |
| --- | --- |
| Tipo de proyecto | CRM web full stack |
| Backend | Express + Sequelize + MySQL |
| Frontend | HTML + JavaScript + Tailwind CSS |
| Autenticación | JWT + cookie HTTP-only |
| Roles | `admin`, `staff` |
| Seguridad | Helmet, CORS, bcryptjs, rate limit |
| Documentación | README, guía de usuario, API y guía técnica |

---

## 📌 Estado del proyecto

| Área | Estado |
| --- | :---: |
| Backend API | ✅ Funcional |
| Frontend | ✅ Funcional |
| Autenticación | ✅ Funcional |
| Roles y permisos | ✅ Funcional |
| Documentación | ✅ Incluida |
| Tests automatizados | ✅ Configurados en backend |

---

## 👨‍💻 Autoría

Proyecto final desarrollado como parte del módulo **Backend Nivel Avanzado**.
