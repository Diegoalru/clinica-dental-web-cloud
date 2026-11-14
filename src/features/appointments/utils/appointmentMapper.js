import { parseClinicDate, toClinicIsoDate } from '../../../utils/clinicTime.js'

const minutesBetween = (start, end) => Math.round((parseClinicDate(end) - parseClinicDate(start)) / 60000)

/** Adapta una cita del API para las tarjetas y la agenda del frontend. */
export function toDisplayAppointment(item) {
  return {
    ...item,
    date: toClinicIsoDate(item.startsAt),
    patient: { id: item.patientId, fullName: item.patientName },
    dentist: { id: item.dentistId, displayName: item.dentistName },
    service: {
      id: item.serviceId,
      name: item.serviceName,
      durationMinutes: minutesBetween(item.startsAt, item.endsAt),
    },
  }
}

/**
 * Adapta GET /appointments/:id para el detalle: lo mismo que toDisplayAppointment más el contacto del paciente,
 * la bitácora y las notificaciones.
 */
export function toAppointmentDetail(item) {
  const appointment = toDisplayAppointment(item)
  return {
    ...appointment,
    patient: {
      ...appointment.patient,
      identification: item.patientIdentification,
      phone: item.patientPhone,
      email: item.patientEmail,
    },
    logs: item.logs ?? [],
    notifications: item.notifications ?? [],
  }
}

/** Una cita ya empezó si su hora de inicio no está en el futuro. Compara instantes: no depende de la zona. */
export function hasStarted(appointment, now = new Date()) {
  return parseClinicDate(appointment.startsAt) <= now
}
