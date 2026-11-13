import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { applyApiErrors } from '@/utils/formErrors'
import { registerRules } from '@/features/auth/validation/authRules'

export const PATIENT_DEFAULTS = {
  fullName: '',
  identification: '',
  birthDate: '',
  phone: '',
  email: '',
  emergencyContact: '',
  acceptsDataConsent: false,
  createPortalAccess: false,
}

const FIELDS = Object.keys(PATIENT_DEFAULTS)

// Reglas del paciente: las mismas que el registro, sin contraseña, y correo opcional
const rules = {
  fullName: registerRules.fullName,
  identification: registerRules.identification,
  birthDate: registerRules.birthDate,
  phone: registerRules.phone,
  email: {
    maxLength: registerRules.email.maxLength,
    validate: (value) => !value?.trim() || registerRules.email.validate(value),
  },
  emergencyContact: registerRules.emergencyContact,
  acceptsDataConsent: registerRules.acceptsDataConsent,
  createPortalAccess: {},
}

/**
 * Formulario de registro/edición de paciente (recepción). Misma forma que useRegisterForm.
 * `onSaved(values)` se llama tras guardar; `initialValues` precarga para editar.
 *
 * TODO(api): patientsService.create(values) / update(id, values). 409 → mensaje general con enlace al registro.
 */
export function usePatientForm({ initialValues, onSaved } = {}) {
  const [formError, setFormError] = useState(null)
  const form = useForm({ defaultValues: { ...PATIENT_DEFAULTS, ...initialValues } })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      // TODO(api): const saved = await patientsService.create(values)
      onSaved?.(values)
      form.reset(PATIENT_DEFAULTS)
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
      form.reset({ ...PATIENT_DEFAULTS, ...initialValues })
    },
  }
}
