import { ApiService } from '@/api'
import { toApiDateTime } from '@/utils/clinicTime'

const appointmentsApi = new ApiService('/appointments')

/**
 * Llamadas al API de citas. El flujo de reserva del paciente usa los endpoints reales;
 * otras vistas del módulo todavía tienen datos de maqueta.
 */
export const appointmentsService = {
  /** GET /appointments?date=&dentistId=&patientId=&status= */
  list(params, config) {
    return appointmentsApi.get('', { params, ...config })
  },

  /** GET /appointments/:id (incluye paciente, odontólogo, servicio, bitácora y notificaciones). */
  get(id, config) {
    return appointmentsApi.get(`/${id}`, config)
  },

  /** GET /appointments/availability?dentistId=&serviceId=&date= → [{ time, available }] */
  availability({ dentistId, serviceId, date }, config) {
    return appointmentsApi.get('/availability', { params: { dentistId, serviceId, date }, ...config })
  },

  /**
   * POST /appointments. La cita nace en PENDING; el API guarda el precio de referencia y la bitácora.
   * @param {{ patientId: number, dentistId: number, serviceId: number, date: string, time: string, notes?: string }} form
   */
  create({ patientId, dentistId, serviceId, date, time, notes }) {
    return appointmentsApi.post('', {
      patientId,
      dentistId,
      serviceId,
      startsAt: toApiDateTime(date, time),
      notes: notes || null,
    })
  },

  /** PATCH /appointments/:id/status { status: 'CONFIRMED' } */
  confirm(id) {
    return appointmentsApi.patch(`/${id}/status`, { status: 'CONFIRMED' })
  },

  /** PATCH /appointments/:id/reschedule { startsAt, dentistId, remarks } */
  reschedule(id, { date, time, dentistId, remarks }) {
    return appointmentsApi.patch(`/${id}/reschedule`, {
      startsAt: toApiDateTime(date, time),
      dentistId,
      remarks: remarks || null,
    })
  },

  /** PATCH /appointments/:id/status { status: 'CANCELLED', remarks } */
  cancel(id, remarks) {
    return appointmentsApi.patch(`/${id}/status`, { status: 'CANCELLED', remarks })
  },

  /** PATCH /appointments/:id/status { status: 'NO_SHOW' } */
  markNoShow(id) {
    return appointmentsApi.patch(`/${id}/status`, { status: 'NO_SHOW' })
  },

  /** POST /appointments/:id/notifications/resend */
  resendConfirmation(id) {
    return appointmentsApi.post(`/${id}/notifications/resend`)
  },
}
