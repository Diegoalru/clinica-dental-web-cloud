import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

const features = [
  {
    icon: 'calendar',
    title: 'Agenda de citas',
    text: 'Reserve con validación de horarios, bloqueos y citas existentes para evitar duplicados.',
  },
  {
    icon: 'file-text',
    title: 'Expediente clínico',
    text: 'Diagnóstico, tratamiento y notas de cada atención vinculados a la cita.',
  },
  {
    icon: 'mail',
    title: 'Recordatorios por correo',
    text: 'Confirmaciones y recordatorios automáticos para mejorar la asistencia.',
  },
]

const steps = [
  { title: 'Elija el servicio', text: 'Limpieza, valoración, resinas y más, con duración y precio de referencia.' },
  { title: 'Escoja odontólogo y horario', text: 'Solo se muestran profesionales habilitados y espacios realmente libres.' },
  { title: 'Reciba la confirmación', text: 'Le avisamos por correo y le recordamos antes de la cita.' },
]

function Landing() {
  const { isAuthenticated, isLoading, user } = useAuth()

  // Sin sesión el botón lleva al login (que recuerda el destino); con sesión, al módulo que corresponde
  const ctaTo = !isAuthenticated
    ? ROUTES.LOGIN
    : user.role === ROLES.PATIENT
      ? ROUTES.PATIENT_BOOK
      : ROUTES.DASHBOARD
  const ctaLabel = isAuthenticated && user.role !== ROLES.PATIENT ? 'Ir a mi panel' : 'Agendar cita'

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
            <Icon name="tooth" size={14} />
            Sistema web para consultorios dentales
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Gestión simple para su clínica dental
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Pacientes, odontólogos, servicios y citas en un solo lugar, accesible desde cualquier dispositivo.
          </p>
          {!isLoading && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button as={Link} to={ctaTo} state={!isAuthenticated ? { from: ROUTES.PATIENT_BOOK } : undefined} size="lg" icon="calendar">
                {ctaLabel}
              </Button>
              {!isAuthenticated && (
                <Button as={Link} to={ROUTES.REGISTER} variant="secondary" size="lg">
                  Crear cuenta de paciente
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <span className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon name={feature.icon} size={22} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900">Agendar toma un minuto</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

export default Landing
