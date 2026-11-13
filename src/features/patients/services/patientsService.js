import { ApiService } from '@/api'

const patientsApi = new ApiService('/patients')

/**
 * Llamadas al API de pacientes. ESQUELETO: las páginas todavía usan features/patients/mocks/.
 */
export const patientsService = {
  /** GET /patients?search=&status=&page=&pageSize= */
  list(params, config) {
    return patientsApi.get('', { params, ...config })
  },

  /** GET /patients/:id */
  get(id, config) {
    return patientsApi.get(`/${id}`, config)
  },

  /** GET /patients/me (el paciente con sesión; user.patientId) */
  me(config) {
    return patientsApi.get('/me', config)
  },

  /**
   * POST /patients. Responde 400 (validación) o 409 (identificación duplicada).
   * `createPortalAccess` pide al API crear la cuenta de usuario e invitar por correo.
   */
  create(form) {
    return patientsApi.post('', form)
  },

  /** PUT /patients/:id */
  update(id, form) {
    return patientsApi.put(`/${id}`, form)
  },
}
