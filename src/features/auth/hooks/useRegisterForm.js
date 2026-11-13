import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { applyApiErrors } from '@/utils/formErrors'
import { registerRules } from '../validation/authRules'

const DEFAULT_VALUES = {
  fullName: '',
  identification: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  birthDate: '',
  emergencyContact: '',
  acceptsDataConsent: false,
}

const FIELDS = Object.keys(DEFAULT_VALUES)

/**
 * Lógica del formulario de registro de pacientes, separada de cómo se ve.
 *
 * El API crea la cuenta y devuelve la sesión iniciada, así que tras un registro correcto
 * GuestRoute redirige igual que en el login.
 */
export function useRegisterForm() {
  const { register: registerAccount } = useAuth()
  const [formError, setFormError] = useState(null)

  const form = useForm({ defaultValues: DEFAULT_VALUES })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      // confirmPassword solo sirve en el formulario; authService arma el cuerpo sin ese campo
      await registerAccount(values)
    } catch (error) {
      // 400: errores por campo. 409: correo o identificación ya registrados (mensaje general)
      setFormError(applyApiErrors(error, form.setError, FIELDS))
    }
  })

  return {
    field: (name) => form.register(name, registerRules[name]),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    formError,
    onSubmit,
  }
}
