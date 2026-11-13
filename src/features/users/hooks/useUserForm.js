import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { applyApiErrors } from '@/utils/formErrors'
import { registerRules } from '@/features/auth/validation/authRules'

export const USER_DEFAULTS = {
  fullName: '',
  email: '',
  phone: '',
  role: '',
  sendInvitation: true,
}

const FIELDS = Object.keys(USER_DEFAULTS)

// Reutiliza las reglas de cuenta del módulo auth; el rol es obligatorio
const rules = {
  fullName: registerRules.fullName,
  email: registerRules.email,
  phone: registerRules.phone,
  role: { required: 'Seleccione un rol.' },
  sendInvitation: {},
}

/**
 * Formulario de usuario (administración). Mismo contrato que useLoginForm.
 * TODO(api): usersService.create(values) / update(id, values). 409 → correo ya registrado (mensaje general).
 */
export function useUserForm({ initialValues, onSaved } = {}) {
  const [formError, setFormError] = useState(null)
  const form = useForm({ defaultValues: { ...USER_DEFAULTS, ...initialValues } })
  const watchRole = useWatch({ control: form.control, name: 'role' })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      // TODO(api): await (initialValues?.id ? usersService.update(initialValues.id, values) : usersService.create(values))
      onSaved?.(values)
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
    watchRole,
    reset: () => {
      setFormError(null)
      form.reset({ ...USER_DEFAULTS, ...initialValues })
    },
  }
}
