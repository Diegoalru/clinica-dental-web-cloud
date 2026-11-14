import { ApiService } from '@/api'
import { toApiDateTime } from '@/utils/clinicTime'

const appointmentsApi = new ApiService('/appointments')

/**
 * Llamadas al API de citas. Los flujos de reserva de paciente y personal usan los endpoints reales;
 * otras vistas del módulo todavía tienen datos de maqueta.
 */
export const appointmentsService = {
  /** GET /appointments?from=&to=&dentistId=&patientId=&status= */
  list(params, config) {
    return appointmentsApi.get('', { params, ...config })
  },

  async listAll(params = {}, config = {}) {
    const items = []
    let page = 1
    while (true) {
      const response = await appointmentsApi.get('', { params: { ...params, page, pageSize: 100 }, ...config })
      items.push(...response.items)
      if (items.length >= response.totalCount || response.items.length === 0) return items
      page += 1
    }
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
   * @param {{ patientId: number, dentistId: number, serviceId: number, date: string, time: string }} form
   */
  create({ patientId, dentistId, serviceId, date, time }) {
    return appointmentsApi.post('', {
      patientId,
      dentistId,
      serviceId,
      startsAt: toApiDateTime(date, time),
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
