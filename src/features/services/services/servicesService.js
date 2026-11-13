import { ApiService } from '@/api'

const servicesApi = new ApiService('/services')
const specialtiesApi = new ApiService('/specialties')

/**
 * Llamadas al API del catálogo de servicios y especialidades.
 * ESQUELETO: las páginas todavía usan features/services/mocks/.
 */
export const servicesService = {
  /** GET /services?status= (el paciente solo ve ACTIVE) */
  list(params, config) {
    return servicesApi.get('', { params, ...config })
  },

  /** POST /services { name, description, durationMinutes, price, status } */
  create(form) {
    return servicesApi.post('', form)
  },

  /** PUT /services/:id. Cambiar el precio no altera citas ya agendadas (price_snapshot). */
  update(id, form) {
    return servicesApi.put(`/${id}`, form)
  },

  /** GET /specialties */
  listSpecialties(config) {
    return specialtiesApi.get('', config)
  },

  /** POST /specialties { name, description } */
  createSpecialty(form) {
    return specialtiesApi.post('', form)
  },
}
