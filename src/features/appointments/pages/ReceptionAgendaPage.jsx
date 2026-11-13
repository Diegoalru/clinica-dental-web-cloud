import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import Legend from '@/components/common/Legend'
import PageContainer from '@/components/common/PageContainer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import Stat from '@/components/ui/Stat'
import Tabs from '@/components/ui/Tabs'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES } from '@/constants/appointmentStatus'
import { ROUTES, receptionAppointmentRoute } from '@/constants/routes'
import { addDays, formatIsoDateLong, formatTime24 } from '@/utils/dateLabels'
import { activeDentists } from '@/features/dentists/mocks/dentists'
import AgendaGrid from '../components/AgendaGrid'
import { MOCK_TODAY, appointmentsByDate, notificationsSummary } from '../mocks/appointments'

const VIEWS = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
]

/** Agenda del día (recepción y administración). */
function ReceptionAgendaPage() {
  const [date, setDate] = useState(MOCK_TODAY)
  const [view, setView] = useState('day')
  const [dentistFilter, setDentistFilter] = useState('')
  const [query, setQuery] = useState('')

  // TODO(api): appointmentsService.list({ date, dentistId }) y dentistsService.list({ status: 'ACTIVE' })
  const dentists = dentistFilter ? activeDentists.filter((d) => d.id === Number(dentistFilter)) : activeDentists
  const appointments = useMemo(() => {
    const text = query.trim().toLowerCase()
    return appointmentsByDate(date).filter(
      (item) =>
        (!dentistFilter || item.dentist.id === Number(dentistFilter)) &&
        (!text || item.patient.fullName.toLowerCase().includes(text) || String(item.id).includes(text)),
    )
  }, [date, dentistFilter, query])

  const count = (status) => appointments.filter((item) => item.status === status).length
  const pendingToConfirm = appointments.filter((item) => item.status === APPOINTMENT_STATUS.PENDING)

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Recepción"
        title="Agenda del día"
        actions={
          <>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar paciente o cita" className="w-full sm:w-64" />
            <Button as={Link} to={ROUTES.RECEPTION_NEW_APPOINTMENT} icon="plus">
              Nueva cita
            </Button>
          </>
        }
      />

      <Card padding={false}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="icon-sm" onClick={() => setDate(addDays(date, -1))} aria-label="Día anterior">
              <Icon name="chevron-left" size={16} />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setDate(MOCK_TODAY)}>
              Hoy
            </Button>
            <Button variant="secondary" size="icon-sm" onClick={() => setDate(addDays(date, 1))} aria-label="Día siguiente">
              <Icon name="chevron-right" size={16} />
            </Button>
          </div>
          <p className="text-sm font-semibold text-slate-900">{formatIsoDateLong(date)}</p>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Tabs variant="pills" items={VIEWS} value={view} onChange={setView} label="Vista" />
            <Select
              value={dentistFilter}
              onChange={(event) => setDentistFilter(event.target.value)}
              aria-label="Filtrar por odontólogo"
              className="w-52"
            >
              <option value="">Todos los odontólogos</option>
              {activeDentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.displayName}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            {view === 'day' ? (
              <AgendaGrid dentists={dentists} appointments={appointments} date={date} />
            ) : (
              <p className="px-6 py-16 text-center text-sm text-slate-500">
                La vista semanal estará disponible cuando el API entregue las citas por rango de fechas.
              </p>
            )}
            <div className="border-t border-slate-100 px-4 py-3">
              <Legend
                items={[
                  ...Object.values(APPOINTMENT_STATUS).map((status) => ({
                    label: APPOINTMENT_STATUS_LABELS[status],
                    tone: APPOINTMENT_STATUS_TONES[status],
                  })),
                  { label: 'Bloqueo', className: 'bg-stripes border border-zinc-300' },
                ]}
              />
            </div>
          </div>

          <aside className="space-y-4 border-t border-slate-100 p-4 lg:border-t-0 lg:border-l">
            <section aria-label="Resumen del día">
              <h2 className="text-sm font-semibold text-slate-900">Resumen del día</h2>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Stat compact label="Total" value={appointments.length} />
                <Stat compact label="Pendientes" value={count(APPOINTMENT_STATUS.PENDING)} tone="amber" />
                <Stat compact label="Confirmadas" value={count(APPOINTMENT_STATUS.CONFIRMED)} tone="sky" />
                <Stat compact label="Completadas" value={count(APPOINTMENT_STATUS.COMPLETED)} tone="emerald" />
              </div>
            </section>

            <section aria-label="Pendientes de confirmar">
              <h2 className="text-sm font-semibold text-slate-900">Pendientes de confirmar</h2>
              <ul className="mt-2 space-y-2">
                {pendingToConfirm.length === 0 && <li className="text-sm text-slate-500">Nada pendiente.</li>}
                {pendingToConfirm.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <Link to={receptionAppointmentRoute(item.id)} className="block truncate text-sm font-medium text-slate-900 hover:text-brand-700">
                        {item.patient.fullName}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {formatTime24(item.startsAt)} · {item.dentist.displayName}
                      </p>
                    </div>
                    {/* TODO(api): appointmentsService.confirm(item.id) */}
                    <Button size="sm" variant="secondary" icon="check">
                      Confirmar
                    </Button>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label="Notificaciones por correo">
              <h2 className="text-sm font-semibold text-slate-900">Notificaciones por correo</h2>
              <dl className="mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Enviadas hoy</dt>
                  <dd className="font-medium text-slate-900">{notificationsSummary.sentToday}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Programadas</dt>
                  <dd className="font-medium text-slate-900">{notificationsSummary.scheduled}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Fallidas</dt>
                  <dd className="font-medium text-rose-600">{notificationsSummary.failed}</dd>
                </div>
              </dl>
              <Button variant="link" className="mt-2" disabled>
                Ver fallidas
              </Button>
            </section>
          </aside>
        </div>
      </Card>
    </PageContainer>
  )
}

export default ReceptionAgendaPage
