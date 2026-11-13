import { ApiService } from '@/api'

const dentistsApi = new ApiService('/dentists')

/**
 * Llamadas al API de odontólogos. ESQUELETO: las páginas todavía usan features/dentists/mocks/.
 */
export const dentistsService = {
  /** GET /dentists?serviceId=&status= */
  list(params, config) {
    return dentistsApi.get('', { params, ...config })
  },

  /** GET /dentists/:id (perfil, servicios habilitados, horario semanal y bloqueos) */
  get(id, config) {
    return dentistsApi.get(`/${id}`, config)
  },

  /** GET /dentists/me (el odontólogo con sesión; user.dentistId) */
  me(config) {
    return dentistsApi.get('/me', config)
  },

  /** PUT /dentists/:id { specialtyId, licenseNumber } */
  update(id, form) {
    return dentistsApi.put(`/${id}`, form)
  },

  /** PATCH /dentists/:id/status { status } */
  setStatus(id, status) {
    return dentistsApi.patch(`/${id}/status`, { status })
  },

  /** PUT /dentists/:id/services { serviceIds: [] } */
  setServices(id, serviceIds) {
    return dentistsApi.put(`/${id}/services`, { serviceIds })
  },

  /** PUT /dentists/:id/schedules [{ dayOfWeek, startTime, endTime }] */
  setSchedules(id, schedules) {
    return dentistsApi.put(`/${id}/schedules`, schedules)
  },

  /** POST /dentists/:id/blocks { startsAt, endsAt, reason }. 409 si choca con citas (lista las citas a reprogramar). */
  addBlock(id, block) {
    return dentistsApi.post(`/${id}/blocks`, block)
  },

  /** DELETE /dentists/:id/blocks/:blockId */
  removeBlock(id, blockId) {
    return dentistsApi.delete(`/${id}/blocks/${blockId}`)
  },
}
