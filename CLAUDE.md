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
npm run preview   # sirve el build
```

No hay framework de pruebas configurado todavía.

## Arquitectura

- **JavaScript (JSX), no TypeScript.** Linter: Oxlint (`.oxlintrc.json`).
- **Alias `@` → `src/`** (definido en `vite.config.js` y `jsconfig.json`). Usar `@/...` en lugar de rutas relativas largas.
- **Tailwind v4** vía plugin `@tailwindcss/vite`; `src/index.css` solo contiene `@import "tailwindcss"`. No hay `tailwind.config.js`.
- **React Router v8 en modo data router:** las rutas viven en `src/router/index.jsx` con `createBrowserRouter`, y `main.jsx` monta el `RouterProvider` (no existe `App.jsx`). Las rutas hijas cuelgan de `MainLayout`; `errorElement` (`ErrorPage`) atrapa errores inesperados y `path: '*'` muestra `NotFound`. Importar todo desde `react-router`, no `react-router-dom`.
- **Organización por funcionalidad:** `src/features/<modulo>/{components,hooks,services,pages}` con un módulo por área del modelo de datos (auth, patients, dentists, services, appointments, medical-records, reports). Lo compartido va en `components/{ui,common}`, `hooks`, `utils`, `layouts`, `context`, `constants`. Muchas carpetas solo contienen `.gitkeep`; borrarlo al agregar archivos reales.

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
- `components/common/GuestRoute.jsx`: ruta padre de login y registro. Con sesión redirige al destino recordado o a `/inicio`; por eso los formularios no navegan después de iniciar sesión.
- `constants/routes.js` (rutas) y `constants/roles.js` (roles del API, sus etiquetas y los grupos `STAFF_ROLES` y `CAN_BOOK_ROLES`).

### Formularios

Patrón del módulo `auth`, a repetir en los demás:

- La lógica va en un hook (`features/auth/hooks/useLoginForm.js`, `useRegisterForm.js`) que devuelve `field(nombre)`, `errors`, `formError`, `isSubmitting` y `onSubmit`. La página solo pinta.
- Las reglas de React Hook Form van aparte (`features/auth/validation/authRules.js`) y repiten las del API.
- `utils/formErrors.js` (`applyApiErrors`) reparte un `ApiError` entre los campos y devuelve el mensaje general.
- `components/ui/FormField.jsx` es el campo base (etiqueta, input, error). Las páginas y este componente tienen estilos mínimos a propósito: el diseño lo trabaja otro integrante y no debe tener que tocar hooks ni servicios.

### Variables de entorno

Configuración por variables de entorno (Twelve-Factor); ver `.env.example`. **El prefijo es `API_`, no `VITE_`**: `vite.config.js` define `envPrefix: 'API_'`, así que solo las variables `API_*` llegan al cliente (`API_BASE_URL`, `API_TIMEOUT`) y cualquier variable `VITE_*` se ignora. Se leen únicamente en `src/config/env.js`, que no tiene valores por defecto: si falta una variable, la aplicación lanza un error al cargar. En local los valores van en `.env` (copia de `.env.example`); en el despliegue se definen en el paso de build del pipeline, porque Vite las incrusta al compilar. `.env` y `.env.*` están en `.gitignore` (excepto `.env.example`).

## Convenciones del equipo (del PDF de propuesta)

- GitHub Flow: `main` protegida, sin push directo; PR con al menos una aprobación y pipeline en verde.
- Ramas descriptivas (`feature/agenda-disponibilidad`, `fix/validacion-fecha`) y commits con Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- Validar entradas en frontend y backend; no guardar secretos ni datos personales reales en el repo.
