// Reglas del expediente clínico en formato de React Hook Form. Repiten las del API (medical_records):
// examen físico, diagnóstico y plan de tratamiento son obligatorios; el resto es opcional.
const trimmed = (value) => (typeof value === 'string' ? value.trim() : value)

const requiredText = (message) => ({
  validate: (value) => Boolean(trimmed(value)) || message,
})

export const medicalRecordRules = {
  symptoms: { maxLength: { value: 2000, message: 'Máximo 2000 caracteres.' } },
  physicalExam: requiredText('Este campo es obligatorio.'),
  diagnosis: requiredText('Este campo es obligatorio.'),
  treatmentPlan: requiredText('Este campo es obligatorio.'),
  prescriptions: { maxLength: { value: 2000, message: 'Máximo 2000 caracteres.' } },
  clinicalNotes: { maxLength: { value: 4000, message: 'Máximo 4000 caracteres.' } },
}
