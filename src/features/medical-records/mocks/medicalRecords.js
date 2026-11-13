// DATOS DE EJEMPLO: sustituir por medicalRecordsService.listByPatient() cuando exista el endpoint.
// Imita medical_records con los datos de la cita (fecha, servicio, odontólogo) ya resueltos.
export const medicalRecords = [
  {
    id: 51,
    appointmentId: 980,
    patientId: 1,
    date: '2026-10-02T09:30:00-06:00',
    serviceName: 'Resina / calza',
    dentistName: 'Dra. Laura Mora',
    symptoms: 'Sensibilidad al frío en molar inferior derecho.',
    physicalExam: 'Caries oclusal en pieza 46, sin compromiso pulpar.',
    diagnosis: 'Caries dental pieza 46.',
    treatmentPlan: 'Restauración con resina compuesta. Control en 3 meses.',
    prescriptions: null,
    clinicalNotes: 'Paciente tolera bien la anestesia local.',
  },
  {
    id: 44,
    appointmentId: 790,
    patientId: 1,
    date: '2026-03-14T10:00:00-06:00',
    serviceName: 'Limpieza dental',
    dentistName: 'Dr. Carlos Vargas',
    symptoms: 'Sangrado leve al cepillarse.',
    physicalExam: 'Placa y sarro moderado en sector anterior inferior.',
    diagnosis: 'Gingivitis leve.',
    treatmentPlan: 'Profilaxis completa. Técnica de cepillado y uso de hilo dental.',
    prescriptions: 'Enjuague con clorhexidina 0,12 % por 7 días.',
    clinicalNotes: null,
  },
  {
    id: 47,
    appointmentId: 801,
    patientId: 6,
    date: '2026-05-20T09:00:00-06:00',
    serviceName: 'Limpieza dental',
    dentistName: 'Dra. Laura Mora',
    symptoms: null,
    physicalExam: 'Sin hallazgos relevantes.',
    diagnosis: 'Control preventivo.',
    treatmentPlan: 'Profilaxis. Control en 6 meses.',
    prescriptions: null,
    clinicalNotes: null,
  },
  {
    id: 49,
    appointmentId: 802,
    patientId: 2,
    date: '2026-07-08T13:00:00-06:00',
    serviceName: 'Resina / calza',
    dentistName: 'Dra. Laura Mora',
    symptoms: 'Dolor al masticar.',
    physicalExam: 'Fractura de restauración previa en pieza 36.',
    diagnosis: 'Fractura de restauración pieza 36.',
    treatmentPlan: 'Reemplazo de resina.',
    prescriptions: 'Ibuprofeno 400 mg cada 8 h por 2 días si hay dolor.',
    clinicalNotes: null,
  },
]

export const recordsByPatient = (patientId) =>
  medicalRecords
    .filter((record) => record.patientId === Number(patientId))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
