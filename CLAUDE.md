# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Frontend (SPA) del sistema web para consultorios dentales del curso "Desarrollo de Aplicaciones para la Computación en la Nube" (16-0550). El backend es una API REST ASP.NET Core sobre .NET 10 versionada en `/api/v1` (repositorio aparte); este repo solo consume esa API. El contexto funcional (módulos, roles, modelo de datos, stack) está en `context/Proyecto Avance 1.pdf`; extraer el texto con `pdftotext -layout`.

Roles del sistema: administrador, recepcionista, odontólogo, paciente. Stack acordado: React + Vite, React Router, Axios, React Hook Form, Tailwind CSS, mobile-first. Despliegue previsto en Azure Static Web Apps.

## Comandos

```bash
npm install
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción a dist/
npm run lint      # oxlint (no ESLint)
npm test          # pruebas con el runner nativo de Node (archivos *.test.js), sin dependencias extra
npm run preview   # sirve el build

# Imagen Docker (nginx sin privilegios en el puerto 8080). API_BASE_URL es obligatorio: Vite lo incrusta al compilar
docker build --build-arg API_BASE_URL=http://localhost:5125/api/v1 -t clinica-dental-web .
docker run --rm -p 3000:8080 clinica-dental-web
```

Las pruebas no usan Vitest: `node --test` alcanza para utilidades puras (`src/utils/clinicTime.test.js`). El entorno completo (base, API y web) se levanta con el `docker-compose.yml` del workspace.

## Arquitectura

- **JavaScript (JSX), no TypeScript.** Linter: Oxlint (`.oxlintrc.json`).
- **Alias `@` → `src/`** (definido en `vite.config.js` y `jsconfig.json`). Usar `@/...` en lugar de rutas relativas largas.
- **Tailwind v4** vía plugin `@tailwindcss/vite`. `src/index.css` importa Tailwind y define los tokens en `@theme` (`--color-brand-*` = paleta celeste, fuente Inter) y la utilidad `bg-stripes` (bloqueos de agenda). No hay `tailwind.config.js`. Usar `bg-brand-600`, `text-brand-700`, etc., no `sky-*` directo.
- **React Router v8 en modo data router:** `src/router/routes.jsx` define las rutas (reutilizable con un router estático en pruebas), `src/router/lazyPages.jsx` los `React.lazy` de las páginas por rol y `src/router/index.jsx` crea el `createBrowserRouter`; `main.jsx` monta el `RouterProvider` (no existe `App.jsx`). Las rutas hijas cuelgan de `MainLayout`; `errorElement` (`ErrorPage`) atrapa errores inesperados y `path: '*'` muestra `NotFound`. Importar todo desde `react-router`, no `react-router-dom`.
- **Organización por funcionalidad:** `src/features/<modulo>/{components,hooks,services,pages,mocks,validation}` con un módulo por área del modelo de datos (auth, patients, dentists, services, appointments, medical-records, reports, users). Lo compartido va en `components/{ui,common}`, `hooks`, `utils`, `layouts`, `context`, `constants`. Borrar el `.gitkeep` al agregar archivos reales a una carpeta.
- **Datos de ejemplo:** las pantallas de los módulos (todo menos auth) leen de `features/<modulo>/mocks/*.js` mientras no existan los endpoints; cada lectura tiene un comentario `TODO(api)` con el método de `features/<modulo>/services/*Service.js` (esqueletos sobre `ApiService`) que debe sustituirla. `features/appointments/mocks/appointments.js` fija `MOCK_TODAY` como "hoy" de las agendas. `UI_FLOWS.md` documenta cada flujo y qué mock alimenta cada página.
- **Constantes de dominio:** `constants/appointmentStatus.js` (estados de cita, entidad y notificación tal como el CHECK de la base, con etiquetas y tonos), `constants/navigation.js` (`NAV_BY_ROLE` para el header y el hub de inicio), `constants/routes.js` (incluye `receptionAppointmentRoute(id)` y `dentistAttentionRoute(id)`).

### Capa de API (`src/api/`)

Toda comunicación con el backend pasa por aquí; no usar `axios` directamente en componentes.

- `httpClient.js`: única instancia de Axios. El interceptor de request agrega `Authorization: Bearer <jwt>`; el de response convierte cualquier fallo en `ApiError` y, ante un 401, limpia el token.
- `httpClient.js`: además, cuando un 401 llega en una solicitud que llevaba token, llama al manejador registrado con `setSessionExpiredHandler` (lo registra `AuthProvider`). El 401 del login no lleva token y no cierra nada.
- `ApiService.js`: clase genérica por recurso (`new ApiService('/patients')`) con `get`, `post`, `put`, `patch` y `delete`, que devuelven el cuerpo de la respuesta. Los servicios de cada módulo deben crearse en `features/<modulo>/services/` sobre esta clase (ejemplo: `features/auth/services/authService.js`).
- `ApiError.js`: error normalizado (`status`, `data`, `fieldErrors`, `isNetworkError`, `isValidation`, `isUnauthorized`, `isForbidden`, `isConflict`). El mensaje sale de `data.title` (ProblemDetails del API, en español). `fieldErrors` sale de `data.errors` de los 400 de validación, con las claves en camelCase (`Email` → `email`) y solo el primer mensaje de cada campo.
- El JWT se lee/escribe solo mediante `src/utils/tokenStorage.js`.

### Sesión y rutas

- `context/AuthProvider.jsx` envuelve al router en `main.jsx`. Guarda solo el token; el usuario vive en memoria y se recupera con `GET /auth/me` al cargar la página. Expone `user`, `isAuthenticated`, `isLoading`, `login`, `register`, `logout` y `hasRole`, que se leen con `hooks/useAuth.js`.
- `components/common/ProtectedRoute.jsx`: ruta padre que exige sesión y, con la prop `roles`, un rol. Sin sesión envía a `/login` recordando el destino; con otro rol, a `/acceso-denegado`.
- `components/common/GuestRoute.jsx`: ruta padre de login y registro. Con sesión redirige al destino recordado si el rol puede abrirlo, o a `/inicio`; por eso los formularios no navegan después de iniciar sesión.
- `constants/routeAccess.js`: roles por área (`AREA_ROLES`, que usa el router) y prefijos de ruta por área (`canRoleAccess`, `resolvePostLoginDestination`). Un área nueva con rol propio se registra en los dos lugares: la ruta en `router/routes.jsx` y el prefijo aquí. Tiene pruebas (`npm test`).
- `constants/routes.js` (rutas) y `constants/roles.js` (roles del API, sus etiquetas y los grupos `STAFF_ROLES` y `CAN_BOOK_ROLES`).

### Formularios

Patrón del módulo `auth`, a repetir en los demás:

- La lógica va en un hook (`features/auth/hooks/useLoginForm.js`, `useRegisterForm.js`) que devuelve `field(nombre)`, `errors`, `formError`, `isSubmitting` y `onSubmit`. La página solo pinta.
- Las reglas de React Hook Form van aparte (`features/auth/validation/authRules.js`) y repiten las del API.
- `utils/formErrors.js` (`applyApiErrors`) reparte un `ApiError` entre los campos y devuelve el mensaje general.
- `components/ui/FormField.jsx` es el campo base (etiqueta, input, error); `Select`, `Textarea` y `Checkbox` siguen el mismo contrato y comparten clases en `components/ui/fieldStyles.js`. El resto de la librería visual (`Button`, `Card`, `PageHeader`, `StatusBadge`, `Stat`, `Modal`, `Table`, `Tabs`, `Stepper`, `Alert`, `EmptyState`, `SearchInput`, `Pagination`, `LoadingState`, `Icon`) está en `components/ui/`; su contrato se resume en `UI_FLOWS.md` §6. Los mismos patrones de hook (`usePatientForm`, `useMedicalRecordForm`, `useServiceForm`, `useUserForm`) se repiten en los demás módulos.
- Las páginas con sesión se envuelven en `components/common/PageContainer.jsx`; login y registro, en `layouts/AuthLayout.jsx`.

### Fechas y horas

La clínica trabaja en hora de Costa Rica y el navegador del usuario puede estar en otra zona. Todo pasa por `src/utils/clinicTime.js`:

- El API responde las fechas con desfase (`2026-11-20T09:00:00-06:00`). Para mostrarlas: `formatClinicDateTime`, `formatClinicDate`, `formatClinicTime`. Para agrupar o comparar: `getClinicParts` y `toClinicIsoDate`.
- Para enviar: `toApiDateTime(fecha, hora)` arma `2026-11-20T09:00:00` sin zona, que el API toma como hora de Costa Rica. Para precargar un formulario: `toClinicIsoDate` y `toClinicTimeInput`.
- "Hoy" es `todayInClinic()`, no la fecha del navegador.
- Las etiquetas para la interfaz ("Vie 13 nov", "10:15 – 11:00", "Noviembre 2026") y la aritmética sobre fechas "AAAA-MM-DD" (`addDays`, `startOfWeek`, `isoWeekday`, `ageFromBirthDate`) están en `src/utils/dateLabels.js`, construidas sobre `clinicTime.js`.
- Nunca `new Date('2026-11-20')` (lo toma como medianoche UTC, que en Costa Rica es el día anterior) ni `getHours()`/`getDate()` sobre fechas del API.
- Si se toca este archivo, correr `npm test` (y en Linux o Docker con otra `TZ`, por ejemplo `TZ=Asia/Tokyo`; Node en Windows ignora `TZ`).

### Variables de entorno

Configuración por variables de entorno (Twelve-Factor); ver `.env.example`. **El prefijo es `API_`, no `VITE_`**: `vite.config.js` define `envPrefix: 'API_'`, así que solo las variables `API_*` llegan al cliente (`API_BASE_URL`, `API_TIMEOUT`) y cualquier variable `VITE_*` se ignora. Se leen únicamente en `src/config/env.js`, que no tiene valores por defecto: si falta una variable, la aplicación lanza un error al cargar. En local los valores van en `.env` (copia de `.env.example`); en el despliegue se definen en el paso de build del pipeline, porque Vite las incrusta al compilar. `.env` y `.env.*` están en `.gitignore` (excepto `.env.example`).

## Convenciones del equipo (del PDF de propuesta)

- GitHub Flow: `main` protegida, sin push directo; PR con al menos una aprobación y pipeline en verde.
- Ramas descriptivas (`feature/agenda-disponibilidad`, `fix/validacion-fecha`) y commits con Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- Validar entradas en frontend y backend; no guardar secretos ni datos personales reales en el repo.
