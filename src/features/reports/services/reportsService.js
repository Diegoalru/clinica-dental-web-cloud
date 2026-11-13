import { ApiService } from '@/api'

const reportsApi = new ApiService('/reports')

/**
 * Llamadas al API de reportes (solo administrador). ESQUELETO: la página todavía usa features/reports/mocks/.
 */
export const reportsService = {
  /**
   * GET /reports/appointments?from=&to=&dentistId=&serviceId=&status=
   * Responde totales, serie semanal por estado y desgloses por odontólogo y servicio.
   */
  summary(filters, config) {
    return reportsApi.get('/appointments', { params: filters, ...config })
  },
}
