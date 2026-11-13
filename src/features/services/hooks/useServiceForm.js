import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ENTITY_STATUS } from '@/constants/appointmentStatus'
import { applyApiErrors } from '@/utils/formErrors'

export const SERVICE_DEFAULTS = {
  name: '',
  description: '',
  durationMinutes: '',
  price: '',
  status: ENTITY_STATUS.ACTIVE,
}

const FIELDS = Object.keys(SERVICE_DEFAULTS)

// Reglas que repiten las restricciones de la tabla services
const rules = {
  name: {
    required: 'El nombre es obligatorio.',
    maxLength: { value: 120, message: 'Máximo 120 caracteres.' },
  },
  description: { maxLength: { value: 500, message: 'Máximo 500 caracteres.' } },
  durationMinutes: {
    required: 'La duración es obligatoria.',
    validate: (value) => (Number.isInteger(Number(value)) && Number(value) > 0) || 'Indique minutos enteros mayores que 0.',
  },
  price: {
    required: 'El precio es obligatorio.',
    validate: (value) => (!Number.isNaN(Number(value)) && Number(value) >= 0) || 'El precio no puede ser negativo.',
  },
  status: {},
}

/**
 * Formulario de servicio (crear o editar). Mismo contrato que useLoginForm.
 * TODO(api): servicesService.create(values) / update(id, values)
 */
export function useServiceForm({ initialValues, onSaved } = {}) {
  const [formError, setFormError] = useState(null)
  const form = useForm({ defaultValues: { ...SERVICE_DEFAULTS, ...initialValues } })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      // TODO(api): await (initialValues?.id ? servicesService.update(initialValues.id, values) : servicesService.create(values))
      onSaved?.({ ...values, durationMinutes: Number(values.durationMinutes), price: Number(values.price) })
    } catch (error) {
      setFormError(applyApiErrors(error, form.setError, FIELDS))
    }
  })

  return {
    field: (name) => form.register(name, rules[name]),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    formError,
    onSubmit,
    reset: () => {
      setFormError(null)
      form.reset({ ...SERVICE_DEFAULTS, ...initialValues })
    },
  }
}
