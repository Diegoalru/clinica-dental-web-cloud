import { ApiService } from '@/api'

const usersApi = new ApiService('/users')

/**
 * Llamadas al API de usuarios (solo administrador). ESQUELETO: la página todavía usa features/users/mocks/.
 */
export const usersService = {
  /** GET /users?search=&role=&status= */
  list(params, config) {
    return usersApi.get('', { params, ...config })
  },

  /**
   * POST /users { fullName, email, phone, role, sendInvitation }.
   * Si el rol es DENTIST el API crea también el perfil profesional vacío.
   */
  create(form) {
    return usersApi.post('', form)
  },

  /** PUT /users/:id */
  update(id, form) {
    return usersApi.put(`/${id}`, form)
  },

  /** PATCH /users/:id/status { status } */
  setStatus(id, status) {
    return usersApi.patch(`/${id}/status`, { status })
  },
}
