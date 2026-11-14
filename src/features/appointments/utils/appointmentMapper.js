import { toClinicIsoDate } from '../../../utils/clinicTime.js'

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
      durationMinutes: Math.round((Date.parse(item.endsAt) - Date.parse(item.startsAt)) / 60000),
    },
  }
}
