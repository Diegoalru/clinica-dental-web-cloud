// Roles tal como los devuelve el API en user.role (tabla roles de la base).
export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  RECEPTIONIST: 'RECEPTIONIST',
  DENTIST: 'DENTIST',
  PATIENT: 'PATIENT',
})

// Nombre que se muestra en la interfaz.
export const ROLE_LABELS = Object.freeze({
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.RECEPTIONIST]: 'Recepcionista',
  [ROLES.DENTIST]: 'Odontólogo',
  [ROLES.PATIENT]: 'Paciente',
})

// Grupos que usa el API para autorizar; sirven para la prop `roles` de ProtectedRoute.
export const STAFF_ROLES = Object.freeze([ROLES.ADMIN, ROLES.RECEPTIONIST])
export const CAN_BOOK_ROLES = Object.freeze([ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT])
