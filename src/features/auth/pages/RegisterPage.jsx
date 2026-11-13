import { Link } from 'react-router'
import FormField from '@/components/ui/FormField'
import { ROUTES } from '@/constants/routes'
import { useRegisterForm } from '../hooks/useRegisterForm'

// Interfaz básica: toda la lógica está en useRegisterForm.
function RegisterPage() {
  const { field, errors, isSubmitting, formError, onSubmit } = useRegisterForm()

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Crear cuenta de paciente</h1>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}

        <FormField
          label="Nombre completo"
          autoComplete="name"
          error={errors.fullName?.message}
          {...field('fullName')}
        />
        <FormField
          label="Identificación"
          hint="Cédula, DIMEX o pasaporte."
          error={errors.identification?.message}
          {...field('identification')}
        />
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
          autoComplete="new-password"
          hint="Entre 8 y 72 caracteres, con al menos una letra y un número."
          error={errors.password?.message}
          {...field('password')}
        />
        <FormField
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...field('confirmPassword')}
        />
        <FormField
          label="Teléfono (opcional)"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...field('phone')}
        />
        <FormField
          label="Fecha de nacimiento (opcional)"
          type="date"
          error={errors.birthDate?.message}
          {...field('birthDate')}
        />
        <FormField
          label="Contacto de emergencia (opcional)"
          error={errors.emergencyContact?.message}
          {...field('emergencyContact')}
        />

        <div>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" className="mt-1" {...field('acceptsDataConsent')} />
            Acepto el tratamiento de mis datos personales.
          </label>
          {errors.acceptsDataConsent && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.acceptsDataConsent.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        ¿Ya tiene cuenta?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-sky-700 underline">
          Inicie sesión
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
