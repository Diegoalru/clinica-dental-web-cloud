# Clínica Dental — Frontend

Aplicación web del sistema para consultorios dentales: inicio de sesión, navegación según el rol del usuario y reserva de citas.

Proyecto del curso Desarrollo de Aplicaciones para la Computación en la Nube (III C 2026).

## Repositorios del sistema

| Repositorio | Contenido |
|---|---|
| [clinica-dental-cloud](https://github.com/durena-dev/clinica-dental-cloud) | Base de datos: migraciones, datos de prueba y documentación (DER, flujos, arquitectura) |
| [clinica-dental-api-cloud](https://github.com/Diegoalru/clinica-dental-api-cloud) | API REST en .NET |
| **clinica-dental-web-cloud** (este) | Frontend en React |

## Tecnologías

- React con Vite
- Consume el API REST del sistema (`/api/v1`) con autenticación JWT
- Las fechas se muestran en hora de Costa Rica

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior (probado con Node 24)
- El API del sistema corriendo (ver [clinica-dental-api-cloud](https://github.com/Diegoalru/clinica-dental-api-cloud)), con `http://localhost:5173` autorizado en su configuración de CORS

## Configuración

Copie la plantilla de variables de entorno:

```powershell
Copy-Item .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `API_BASE_URL` | URL base del API, incluida la versión | `http://localhost:5125/api/v1` |
| `API_TIMEOUT` | Tiempo máximo de espera por solicitud, en milisegundos | `15000` |

Solo las variables con prefijo `API_` llegan al navegador. Aquí no van secretos: todo lo que se define queda visible en el JavaScript publicado.

## Ejecución local

```powershell
git clone https://github.com/Diegoalru/clinica-dental-web-cloud.git
cd clinica-dental-web-cloud
Copy-Item .env.example .env
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Cómo levantar el sistema completo

1. **Base de datos:** la de Supabase ya está en la nube. Para trabajar en local, ver [clinica-dental-cloud](https://github.com/durena-dev/clinica-dental-cloud).
2. **API:** configurar sus variables de entorno y ejecutar `dotnet run` (ver su README). Debe quedar en `http://localhost:5125`.
3. **Frontend:** `npm run dev` en este repositorio y abrir `http://localhost:5173`.

## Credenciales de prueba

Datos ficticios de demostración. Las cuentas existen en la base de datos en la nube y en la base local cargada con el seed.

**Contraseña de todas las cuentas:** `Clinica2026!`

| Rol | Nombre | Correo |
|---|---|---|
| Administrador | Carlos Vargas | admin@clinica.example |
| Recepcionista | Lucía Prado | recepcion@clinica.example |
| Odontóloga | Dra. Ana Mora | ana.mora@clinica.example |
| Odontólogo | Dr. Luis Rojas | luis.rojas@clinica.example |
| Odontóloga | Dra. Marta Vega | marta.vega@clinica.example |
| Paciente | Sofía Castro | sofia.castro@clinica.example |
| Paciente | Mateo Jiménez | mateo.jimenez@clinica.example |

**Prueba sugerida:** iniciar sesión como Sofía Castro (paciente), reservar una cita y verla en su lista de citas.

## Problemas comunes

| Síntoma | Causa y solución |
|---|---|
| "No se pudo conectar con el servidor" | El API no está corriendo, o no autoriza este origen. Revise la consola del navegador (F12): si menciona CORS, agregue `http://localhost:5173` a `Cors__AllowedOrigins__0` en el API y reinícielo |
| Las solicitudes van a otra dirección | Revise `API_BASE_URL` en `.env` y reinicie `npm run dev` |
