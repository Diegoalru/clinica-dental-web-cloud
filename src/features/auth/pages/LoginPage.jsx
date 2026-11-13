import { Link } from 'react-router'
import FormField from '@/components/ui/FormField'
import { ROUTES } from '@/constants/routes'
import { useLoginForm } from '../hooks/useLoginForm'

// Interfaz básica: toda la lógica está en useLoginForm.
function LoginPage() {
  const { field, errors, isSubmitting, formError, onSubmit } = useLoginForm()

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>

      {/* noValidate: valida React Hook Form, no el navegador, para que los mensajes sean los nuestros */}
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}

        <FormField
          label="Correo"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...field('email')}
        />
        <FormField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...field('password')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        ¿No tiene cuenta?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-sky-700 underline">
          Regístrese como paciente
        </Link>
      </p>
    </section>
  )
}

export default LoginPage
