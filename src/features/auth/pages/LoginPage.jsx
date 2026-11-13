import { Link } from 'react-router'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { ROUTES } from '@/constants/routes'
import { useLoginForm } from '../hooks/useLoginForm'

// Interfaz del inicio de sesión: toda la lógica está en useLoginForm.
function LoginPage() {
  const { field, errors, isSubmitting, formError, onSubmit } = useLoginForm()

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Iniciar sesión</h1>
      <p className="mt-1 text-sm text-slate-500">Ingrese con su correo y contraseña.</p>

      {/* noValidate: valida React Hook Form, no el navegador, para que los mensajes sean los nuestros */}
      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        {formError && <Alert tone="error">{formError}</Alert>}

        <FormField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          error={errors.email?.message}
          {...field('email')}
        />
        <FormField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...field('password')}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        ¿No tiene cuenta?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-700 underline-offset-4 hover:underline">
          Regístrese como paciente
        </Link>
      </p>
    </section>
  )
}

export default LoginPage
