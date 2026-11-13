import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { applyApiErrors } from '@/utils/formErrors'
import { loginRules } from '../validation/authRules'

const FIELDS = ['email', 'password']

/**
 * Lógica del formulario de inicio de sesión, separada de cómo se ve.
 * La página solo conecta los campos con `register` y muestra `errors` y `formError`.
 *
 * Después de un login correcto no hay que navegar: GuestRoute redirige en cuanto hay sesión.
 */
export function useLoginForm() {
  const { login } = useAuth()
  const [formError, setFormError] = useState(null)

  const form = useForm({ defaultValues: { email: '', password: '' } })

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values)
    } catch (error) {
      // 401: "Credenciales inválidas." (el API no dice si falló el correo o la contraseña)
      setFormError(applyApiErrors(error, form.setError, FIELDS))
    }
  })

  return {
    // field('email') devuelve las props del <input> con su regla de validación ya aplicada
    field: (name) => form.register(name, loginRules[name]),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    formError,
    onSubmit,
    // Para llenar el formulario desde fuera (por ejemplo, botones de usuarios demo)
    setValues: (values) => form.reset(values),
  }
}
