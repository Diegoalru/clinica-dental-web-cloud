import { Link } from 'react-router'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import FormField from '@/components/ui/FormField'
import { ROUTES } from '@/constants/routes'
import { useRegisterForm } from '../hooks/useRegisterForm'

// Interfaz del registro de pacientes: toda la lógica está en useRegisterForm.
function RegisterPage() {
  const { field, errors, isSubmitting, formError, onSubmit } = useRegisterForm()

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Crear cuenta de paciente</h1>
      <p className="mt-1 text-sm text-slate-500">Con su cuenta podrá agendar citas y consultar su historial.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        {formError && <Alert tone="error">{formError}</Alert>}

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
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...field('email')}
        />

        <div className="grid gap-5 sm:grid-cols-2">
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
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
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
        </div>

        <FormField
          label="Contacto de emergencia (opcional)"
          hint="Nombre y teléfono de una persona de contacto."
          error={errors.emergencyContact?.message}
          {...field('emergencyContact')}
        />

        <Checkbox
          label="Acepto el tratamiento de mis datos personales."
          description="Se guarda la fecha y hora de aceptación."
          error={errors.acceptsDataConsent?.message}
          {...field('acceptsDataConsent')}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        ¿Ya tiene cuenta?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-700 underline-offset-4 hover:underline">
          Inicie sesión
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
