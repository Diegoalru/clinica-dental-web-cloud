import { Link } from 'react-router'
import PageContainer from '@/components/common/PageContainer'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { NAV_BY_ROLE, ROLE_TONES } from '@/constants/navigation'
import { ROLE_LABELS } from '@/constants/roles'
import { ROLES } from '@/constants/roles'
import PatientNextAppointment from '@/features/appointments/components/PatientNextAppointment'
import { useAuth } from '@/hooks/useAuth'

// Página de inicio con sesión: hub con los accesos a los módulos del rol (lo que devuelve GET /auth/me).
function Dashboard() {
  const { user } = useAuth()
  const items = NAV_BY_ROLE[user.role] ?? []
  const firstName = user.fullName.trim().split(/\s+/)[0]

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Inicio"
        title={`Hola, ${firstName}`}
        description="¿Qué desea hacer hoy? Estos son los módulos disponibles para su rol."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
              <Icon name={item.icon} size={22} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-base font-semibold text-slate-900">
                {item.label}
                <Icon name="arrow-right" size={16} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </span>
              <span className="mt-1 block text-sm text-slate-500">{item.description}</span>
            </span>
          </Link>
        ))}
      </div>

      {user.role === ROLES.PATIENT && <PatientNextAppointment />}

      <Card title="Su cuenta" description="Datos que reconoce el sistema para su sesión.">
        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Nombre</dt>
            <dd className="mt-1 font-medium text-slate-900">{user.fullName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Correo</dt>
            <dd className="mt-1 text-slate-700">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Rol</dt>
            <dd className="mt-1">
              <StatusBadge tone={ROLE_TONES[user.role]} data-role={user.role}>
                {ROLE_LABELS[user.role] ?? user.role}
              </StatusBadge>
            </dd>
          </div>
        </dl>
      </Card>
    </PageContainer>
  )
}

export default Dashboard
