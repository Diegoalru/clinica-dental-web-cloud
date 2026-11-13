// DATOS DE EJEMPLO: sustituir por appointmentsService.* cuando existan los endpoints.
// Imita appointments (+ appointment_logs y notifications) con el paciente, odontólogo y servicio ya resueltos,
// que es como se espera que el API los devuelva en los listados.
import { APPOINTMENT_STATUS, NOTIFICATION_STATUS } from '@/constants/appointmentStatus'
import { isoWeekday } from '@/utils/dateLabels'
import { findDentist } from '@/features/dentists/mocks/dentists'
import { findPatient } from '@/features/patients/mocks/patients'
import { findService } from '@/features/services/mocks/services'

// "Hoy" de los datos de ejemplo: todas las pantallas de agenda arrancan en esta fecha.
// TODO(api): usar todayInClinic() cuando las citas vengan del API.
export const MOCK_TODAY = '2026-11-13'

const at = (date, time) => `${date}T${time}:00-06:00`

const raw = [
  { id: 1018, patientId: 2, dentistId: 1, serviceId: 1, date: MOCK_TODAY, start: '08:00', end: '09:00', status: APPOINTMENT_STATUS.COMPLETED },
  { id: 1019, patientId: 3, dentistId: 1, serviceId: 2, date: MOCK_TODAY, start: '09:30', end: '10:00', status: APPOINTMENT_STATUS.NO_SHOW },
  { id: 1024, patientId: 1, dentistId: 1, serviceId: 1, date: MOCK_TODAY, start: '10:15', end: '11:00', status: APPOINTMENT_STATUS.PENDING, notes: '2 atenciones previas', createdFrom: 'portal' },
  { id: 1025, patientId: 5, dentistId: 1, serviceId: 3, date: MOCK_TODAY, start: '13:00', end: '14:00', status: APPOINTMENT_STATUS.PENDING, notes: 'Primera visita' },
  { id: 1026, patientId: 6, dentistId: 1, serviceId: 1, date: MOCK_TODAY, start: '14:30', end: '15:15', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: 1027, patientId: 4, dentistId: 2, serviceId: 1, date: MOCK_TODAY, start: '13:00', end: '13:45', status: APPOINTMENT_STATUS.CANCELLED },
  { id: 1032, patientId: 6, dentistId: 2, serviceId: 2, date: MOCK_TODAY, start: '14:30', end: '15:00', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: 1028, patientId: 7, dentistId: 3, serviceId: 4, date: MOCK_TODAY, start: '09:00', end: '09:30', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: 1029, patientId: 8, dentistId: 3, serviceId: 2, date: MOCK_TODAY, start: '10:30', end: '11:00', status: APPOINTMENT_STATUS.PENDING },
  { id: 1030, patientId: 9, dentistId: 3, serviceId: 4, date: MOCK_TODAY, start: '14:00', end: '14:30', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: 1031, patientId: 1, dentistId: 2, serviceId: 2, date: '2026-11-24', start: '14:30', end: '15:00', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: 1033, patientId: 2, dentistId: 1, serviceId: 2, date: '2026-11-16', start: '08:45', end: '09:15', status: APPOINTMENT_STATUS.CONFIRMED },
  { id: 1034, patientId: 7, dentistId: 3, serviceId: 4, date: '2026-11-17', start: '10:00', end: '10:30', status: APPOINTMENT_STATUS.PENDING },
  // Historial de Ana Solís
  { id: 980, patientId: 1, dentistId: 1, serviceId: 3, date: '2026-10-02', start: '09:30', end: '10:30', status: APPOINTMENT_STATUS.COMPLETED },
  { id: 912, patientId: 1, dentistId: 2, serviceId: 1, date: '2026-08-18', start: '15:00', end: '15:45', status: APPOINTMENT_STATUS.CANCELLED },
  { id: 850, patientId: 1, dentistId: 1, serviceId: 2, date: '2026-06-05', start: '08:00', end: '08:30', status: APPOINTMENT_STATUS.NO_SHOW },
  { id: 790, patientId: 1, dentistId: 2, serviceId: 1, date: '2026-03-14', start: '10:00', end: '10:45', status: APPOINTMENT_STATUS.COMPLETED },
  // Otros antecedentes para "Mis pacientes" del odontólogo
  { id: 801, patientId: 6, dentistId: 1, serviceId: 1, date: '2026-05-20', start: '09:00', end: '09:45', status: APPOINTMENT_STATUS.COMPLETED },
  { id: 802, patientId: 2, dentistId: 1, serviceId: 3, date: '2026-07-08', start: '13:00', end: '14:00', status: APPOINTMENT_STATUS.COMPLETED },
]

export const appointments = raw.map((item) => {
  const service = findService(item.serviceId)
  return {
    id: item.id,
    startsAt: at(item.date, item.start),
    endsAt: at(item.date, item.end),
    date: item.date,
    status: item.status,
    priceSnapshot: service.price,
    notes: item.notes ?? null,
    createdFrom: item.createdFrom ?? 'recepcion',
    patient: findPatient(item.patientId),
    dentist: findDentist(item.dentistId),
    service,
  }
})

export const findAppointment = (id) => appointments.find((appointment) => appointment.id === Number(id))

export const appointmentsByDate = (date) => appointments.filter((appointment) => appointment.date === date)

export const appointmentsByPatient = (patientId) =>
  appointments.filter((appointment) => appointment.patient.id === Number(patientId))

export const appointmentsByDentist = (dentistId) =>
  appointments.filter((appointment) => appointment.dentist.id === Number(dentistId))

// Bitácora (appointment_logs) con el usuario que hizo el cambio ya resuelto.
export const appointmentLogs = {
  1024: [
    {
      id: 1,
      previousStatus: null,
      newStatus: APPOINTMENT_STATUS.PENDING,
      changedAt: '2026-11-10T14:02:00-06:00',
      changedBy: 'Ana Solís (portal)',
      remarks: 'Cita creada desde el portal del paciente.',
    },
    {
      id: 2,
      previousStatus: APPOINTMENT_STATUS.PENDING,
      newStatus: APPOINTMENT_STATUS.PENDING,
      changedAt: '2026-11-10T16:40:00-06:00',
      changedBy: 'María Fallas',
      remarks: 'Reprogramada de 09:30 a 10:15 · «Paciente pidió más tarde».',
    },
  ],
}

// Notificaciones por correo de una cita (tabla notifications).
export const appointmentNotifications = {
  1024: [
    {
      id: 1,
      type: 'CONFIRMATION',
      channel: 'EMAIL',
      status: NOTIFICATION_STATUS.SENT,
      scheduledFor: '2026-11-10T14:02:00-06:00',
      sentAt: '2026-11-10T14:02:00-06:00',
    },
    {
      id: 2,
      type: 'REMINDER',
      channel: 'EMAIL',
      status: NOTIFICATION_STATUS.PENDING,
      scheduledFor: '2026-11-12T10:15:00-06:00',
      sentAt: null,
    },
  ],
}

// Resumen de notificaciones del día para la agenda de recepción.
export const notificationsSummary = { sentToday: 8, scheduled: 12, failed: 1 }

// ---------- Disponibilidad ----------

const BASE_SLOTS = ['08:00', '08:45', '09:30', '10:15', '11:00', '13:00', '13:45', '14:30', '15:15']
const BUSY_BY_DENTIST = {
  1: ['08:00', '09:30', '13:00', '15:15'],
  2: ['08:00', '08:45', '09:30', '10:15', '11:00'],
  3: ['09:30', '13:45'],
}

/**
 * Horarios de un odontólogo en una fecha, cruzando horario semanal, bloqueos y citas existentes.
 * TODO(api): reemplazar por appointmentsService.availability({ dentistId, serviceId, date }).
 * @returns {{ time: string, available: boolean }[]} vacío si ese día no atiende
 */
export function getAvailability(dentistId, date) {
  const dentist = findDentist(dentistId)
  if (!dentist || !date) return []
  const weekday = isoWeekday(date)
  const worksThatDay = dentist.schedules.some((schedule) => schedule.dayOfWeek === weekday)
  if (!worksThatDay) return []
  const busy = BUSY_BY_DENTIST[dentist.id] ?? []
  return BASE_SLOTS.map((time) => ({ time, available: !busy.includes(time) }))
}

/** Días sin atención (sin horario semanal) para pintar el calendario. */
export function dentistWorksOn(dentistId, date) {
  const dentist = findDentist(dentistId)
  if (!dentist) return true
  const weekday = isoWeekday(date)
  return dentist.schedules.some((schedule) => schedule.dayOfWeek === weekday)
}

/** Horarios alternativos que sugiere el sistema cuando el elegido no está libre. */
export const alternativeSlots = [
  { label: 'Lun 16 · 08:45', date: '2026-11-16', time: '08:45', dentistId: 1 },
  { label: 'Lun 16 · 14:30', date: '2026-11-16', time: '14:30', dentistId: 1 },
  { label: 'Mar 17 · 09:30', date: '2026-11-17', time: '09:30', dentistId: 1 },
  { label: 'Dr. Vargas · Vie 13 · 13:45', date: '2026-11-13', time: '13:45', dentistId: 2 },
]
