import { ApiService } from '@/api'

const recordsApi = new ApiService('/medical-records')

/**
 * Llamadas al API del expediente clínico. ESQUELETO: la página todavía usa features/medical-records/mocks/.
 */
export const medicalRecordsService = {
  /** GET /medical-records?patientId= (antecedentes, del más reciente al más antiguo) */
  listByPatient(patientId, config) {
    return recordsApi.get('', { params: { patientId }, ...config })
  },

  /** GET /medical-records/:id */
  get(id, config) {
    return recordsApi.get(`/${id}`, config)
  },

  /**
   * POST /medical-records. Vincula el expediente con la cita y la marca COMPLETED en la misma transacción.
   * Obligatorios: physicalExam, diagnosis, treatmentPlan. Responde 400 con errores por campo.
   */
  create({ appointmentId, symptoms, physicalExam, diagnosis, treatmentPlan, prescriptions, clinicalNotes }) {
    return recordsApi.post('', {
      appointmentId,
      symptoms: symptoms || null,
      physicalExam,
      diagnosis,
      treatmentPlan,
      prescriptions: prescriptions || null,
      clinicalNotes: clinicalNotes || null,
    })
  },
}
