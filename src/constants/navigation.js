import { ROLES } from './roles'
import { ROUTES } from './routes'

// Navegación principal por rol. La usan el header (MainLayout) y el hub de inicio (Dashboard).
// `icon` es el nombre de un icono de components/ui/Icon.jsx.
export const NAV_BY_ROLE = Object.freeze({
  [ROLES.PATIENT]: [
    { label: 'Agendar cita', to: ROUTES.PATIENT_BOOK, icon: 'calendar', description: 'Elija servicio, odontólogo y horario.' },
    { label: 'Mis citas', to: ROUTES.PATIENT_APPOINTMENTS, icon: 'clock', description: 'Próximas citas e historial.' },
    { label: 'Servicios', to: ROUTES.SERVICES, icon: 'package', description: 'Catálogo con duración y precio.' },
    { label: 'Mi perfil', to: ROUTES.PROFILE, icon: 'user', description: 'Datos personales y de contacto.' },
  ],
  [ROLES.RECEPTIONIST]: [
    { label: 'Agenda', to: ROUTES.RECEPTION_AGENDA, icon: 'calendar', description: 'Citas del día por odontólogo.' },
    { label: 'Nueva cita', to: ROUTES.RECEPTION_NEW_APPOINTMENT, icon: 'plus', description: 'Agendar para un paciente.' },
    { label: 'Pacientes', to: ROUTES.RECEPTION_PATIENTS, icon: 'users', description: 'Registro y búsqueda de pacientes.' },
  ],
  [ROLES.DENTIST]: [
    { label: 'Mi agenda', to: ROUTES.DENTIST_AGENDA, icon: 'calendar', description: 'Citas del día y de la semana.' },
    { label: 'Mis pacientes', to: ROUTES.DENTIST_PATIENTS, icon: 'users', description: 'Pacientes atendidos y expedientes.' },
    { label: 'Mi horario', to: ROUTES.DENTIST_SCHEDULE, icon: 'clock', description: 'Horario semanal y bloqueos.' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Reportes', to: ROUTES.ADMIN_REPORTS, icon: 'chart', description: 'Consultas por período, odontólogo y servicio.' },
    { label: 'Odontólogos', to: ROUTES.ADMIN_DENTISTS, icon: 'activity', description: 'Perfil, servicios, horario y bloqueos.' },
    { label: 'Servicios', to: ROUTES.ADMIN_SERVICES, icon: 'package', description: 'Catálogo y especialidades.' },
    { label: 'Usuarios', to: ROUTES.ADMIN_USERS, icon: 'shield', description: 'Cuentas y roles del sistema.' },
    { label: 'Agenda', to: ROUTES.RECEPTION_AGENDA, icon: 'calendar', description: 'Agenda del día de la clínica.' },
    { label: 'Nueva cita', to: ROUTES.RECEPTION_NEW_APPOINTMENT, icon: 'plus', description: 'Agendar para un paciente.' },
  ],
})

// Tono de la insignia de rol en el header.
export const ROLE_TONES = Object.freeze({
  [ROLES.ADMIN]: 'violet',
  [ROLES.RECEPTIONIST]: 'amber',
  [ROLES.DENTIST]: 'emerald',
  [ROLES.PATIENT]: 'sky',
})
