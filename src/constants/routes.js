// Rutas de la aplicación en un solo lugar, para no repetir textos en enlaces y redirecciones.
export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  DASHBOARD: '/inicio',
  FORBIDDEN: '/acceso-denegado',
  PROFILE: '/perfil',

  // Paciente
  PATIENT_BOOK: '/citas/agendar',
  PATIENT_APPOINTMENTS: '/citas',
  SERVICES: '/servicios',

  // Recepción (también la ve el administrador)
  RECEPTION_AGENDA: '/recepcion/agenda',
  RECEPTION_NEW_APPOINTMENT: '/recepcion/citas/nueva',
  RECEPTION_APPOINTMENT_PATTERN: '/recepcion/citas/:id',
  RECEPTION_PATIENTS: '/recepcion/pacientes',

  // Odontólogo
  DENTIST_AGENDA: '/odontologo/agenda',
  DENTIST_ATTENTION_PATTERN: '/odontologo/citas/:id',
  DENTIST_PATIENTS: '/odontologo/pacientes',
  DENTIST_SCHEDULE: '/odontologo/horario',

  // Administrador
  ADMIN_REPORTS: '/admin/reportes',
  ADMIN_DENTISTS: '/admin/odontologos',
  ADMIN_SERVICES: '/admin/servicios',
  ADMIN_USERS: '/admin/usuarios',
})

// Rutas con parámetro: se arman con estas funciones para no concatenar textos en las páginas.
export const receptionAppointmentRoute = (id) => `/recepcion/citas/${id}`
export const dentistAttentionRoute = (id) => `/odontologo/citas/${id}`
