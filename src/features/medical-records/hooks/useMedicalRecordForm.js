import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { applyApiErrors } from '@/utils/formErrors'
import { medicalRecordRules } from '../validation/medicalRecordRules'

const DEFAULT_VALUES = {
  symptoms: '',
  physicalExam: '',
  diagnosis: '',
  treatmentPlan: '',
  prescriptions: '',
  clinicalNotes: '',
}

const FIELDS = Object.keys(DEFAULT_VALUES)

/**
 * Formulario del expediente de una atención. Mismo contrato que useLoginForm.
 * Al guardar, el API vincula el expediente con la cita y la marca como Completada.
 *
 * TODO(api): medicalRecordsService.create({ appointmentId, ...values })
 */
export function useMedicalRecordForm({ appointmentId, onSaved }) {
  const [formError, setFormError] = useState(null)
  const form = useForm({ defaultValues: DEFAULT_VALUES })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      // TODO(api): await medicalRecordsService.create({ appointmentId, ...values })
      onSaved?.({ appointmentId, ...values })
    } catch (error) {
      setFormError(applyApiErrors(error, form.setError, FIELDS))
    }
  })

  return {
    field: (name) => form.register(name, medicalRecordRules[name]),
    errors: form.formState.errors,
    hasErrors: Object.keys(form.formState.errors).length > 0,
    isSubmitting: form.formState.isSubmitting,
    formError,
    onSubmit,
  }
}
