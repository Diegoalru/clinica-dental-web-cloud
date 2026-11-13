// Estados tal como los guarda el API (CHECK de appointments.status en la base).
export const APPOINTMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
})

export const APPOINTMENT_STATUS_LABELS = Object.freeze({
  [APPOINTMENT_STATUS.PENDING]: 'Pendiente',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada',
  [APPOINTMENT_STATUS.NO_SHOW]: 'No asistió',
})

// Tono visual de cada estado; StatusBadge y la agenda lo traducen a clases.
export const APPOINTMENT_STATUS_TONES = Object.freeze({
  [APPOINTMENT_STATUS.PENDING]: 'amber',
  [APPOINTMENT_STATUS.CONFIRMED]: 'sky',
  [APPOINTMENT_STATUS.COMPLETED]: 'emerald',
  [APPOINTMENT_STATUS.CANCELLED]: 'slate',
  [APPOINTMENT_STATUS.NO_SHOW]: 'rose',
})

// Orden en que se listan los estados en filtros y leyendas.
export const APPOINTMENT_STATUS_LIST = Object.freeze(Object.values(APPOINTMENT_STATUS))

// Estado de usuarios, pacientes, odontólogos y servicios (CHECK status IN ('ACTIVE', 'INACTIVE')).
export const ENTITY_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
})

export const ENTITY_STATUS_LABELS = Object.freeze({
  [ENTITY_STATUS.ACTIVE]: 'Activo',
  [ENTITY_STATUS.INACTIVE]: 'Inactivo',
})

export const ENTITY_STATUS_TONES = Object.freeze({
  [ENTITY_STATUS.ACTIVE]: 'emerald',
  [ENTITY_STATUS.INACTIVE]: 'slate',
})

// Estado de notificaciones por correo (tabla notifications).
export const NOTIFICATION_STATUS = Object.freeze({
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
})

export const NOTIFICATION_STATUS_LABELS = Object.freeze({
  [NOTIFICATION_STATUS.PENDING]: 'Pendiente',
  [NOTIFICATION_STATUS.SENT]: 'Enviada',
  [NOTIFICATION_STATUS.FAILED]: 'Fallida',
})

export const NOTIFICATION_STATUS_TONES = Object.freeze({
  [NOTIFICATION_STATUS.PENDING]: 'amber',
  [NOTIFICATION_STATUS.SENT]: 'emerald',
  [NOTIFICATION_STATUS.FAILED]: 'rose',
})

export const NOTIFICATION_TYPE_LABELS = Object.freeze({
  CONFIRMATION: 'Confirmación',
  REMINDER: 'Recordatorio',
  CANCELLATION: 'Cancelación',
})

// Busca la etiqueta y el tono de cualquier estado conocido (cita, entidad o notificación).
export function describeStatus(status) {
  if (status in APPOINTMENT_STATUS_LABELS) {
    return { label: APPOINTMENT_STATUS_LABELS[status], tone: APPOINTMENT_STATUS_TONES[status] }
  }
  if (status in ENTITY_STATUS_LABELS) {
    return { label: ENTITY_STATUS_LABELS[status], tone: ENTITY_STATUS_TONES[status] }
  }
  if (status in NOTIFICATION_STATUS_LABELS) {
    return { label: NOTIFICATION_STATUS_LABELS[status], tone: NOTIFICATION_STATUS_TONES[status] }
  }
  return { label: status, tone: 'slate' }
}
