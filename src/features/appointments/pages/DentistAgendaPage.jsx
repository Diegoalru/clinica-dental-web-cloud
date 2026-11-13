import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'
import Stat from '@/components/ui/Stat'
import StatusBadge from '@/components/ui/StatusBadge'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'
import { dentistAttentionRoute } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { formatDuration } from '@/utils/formatCurrency'
import { formatIsoDateShort, formatTime24, formatTimeRange, isoWeekday } from '@/utils/dateLabels'
import { findDentist } from '@/features/dentists/mocks/dentists'
import WeekStrip from '../components/WeekStrip'
import { MOCK_TODAY, appointmentsByDentist } from '../mocks/appointments'

const OPEN_STATUSES = [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED]

const actionFor = (status) => {
  if (status === APPOINTMENT_STATUS.COMPLETED) return { label: 'Ver expediente', icon: 'file-text', variant: 'secondary' }
  if (status === APPOINTMENT_STATUS.NO_SHOW || status === APPOINTMENT_STATUS.CANCELLED) {
    return { label: 'Ver detalle', icon: 'eye', variant: 'ghost' }
  }
  return { label: 'Abrir cita', icon: 'arrow-right', variant: 'primary' }
}

const minutesBetween = (start, end) => Math.round((new Date(end) - new Date(start)) / 60000)

/** Mi agenda (odontólogo): semana, indicadores y citas del día con bloqueos. */
function DentistAgendaPage() {
  const { user } = useAuth()
  const { state } = useLocation()
  const [date, setDate] = useState(MOCK_TODAY)
  const [message, setMessage] = useState(state?.message ?? null)

  // TODO(api): dentistsService.me() y appointmentsService.list({ dentistId, date }). El mock usa el odontólogo 1.
  const dentist = findDentist(user.dentistId ?? 1)
  const all = useMemo(() => appointmentsByDentist(dentist.id), [dentist.id])
  const dayItems = all.filter((item) => item.date === date).sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1))
  const blocks = dentist.blocks.filter((block) => block.startsAt.startsWith(date))
  const nextId = dayItems.find((item) => OPEN_STATUSES.includes(item.status))?.id

  const timeline = [
    ...dayItems.map((item) => ({ kind: 'appointment', startsAt: item.startsAt, item })),
    ...blocks.map((block) => ({ kind: 'block', startsAt: block.startsAt, item: block })),
  ].sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1))

  const schedule = dentist.schedules
    .filter((item) => item.dayOfWeek === isoWeekday(date))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  const scheduleLabel =
    schedule.length === 0
      ? 'Sin atención este día'
      : `Horario: ${schedule[0].startTime} – ${schedule[schedule.length - 1].endTime}` +
        (schedule.length > 1 ? ` · Pausa ${schedule[0].endTime} – ${schedule[1].startTime}` : '')

  const count = (statuses) => dayItems.filter((item) => statuses.includes(item.status)).length
  const greeting = dentist.displayName.replace(/^(Dra?\.) (\S+) (.*)$/, '$1 $3')

  return (
    <PageContainer>
      {message && (
        <Alert tone="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}

      <PageHeader
        eyebrow={`Buenos días, ${greeting}`}
        title={`Mi agenda · ${formatIsoDateShort(date)}`}
        description={scheduleLabel}
      />

      <Card padding={false}>
        <div className="px-4 py-3">
          <WeekStrip value={date} today={MOCK_TODAY} onChange={setDate} countFor={(iso) => all.filter((item) => item.date === iso).length} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Citas hoy" value={dayItems.length} />
        <Stat label="Atendidas" value={count([APPOINTMENT_STATUS.COMPLETED])} tone="emerald" />
        <Stat label="No asistió" value={count([APPOINTMENT_STATUS.NO_SHOW])} tone="rose" />
        <Stat label="Por atender" value={count(OPEN_STATUSES)} tone="sky" />
      </div>

      <Card title="Citas del día" padding={false}>
        {timeline.length === 0 ? (
          <EmptyState icon="calendar" title="Sin citas este día" description="Elija otro día de la semana para ver sus citas." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {timeline.map((entry) =>
              entry.kind === 'block' ? (
                <li key={`block-${entry.item.id}`} className="flex items-center gap-4 bg-stripes px-5 py-3 text-sm text-zinc-600">
                  <div className="w-16 shrink-0">
                    <p className="font-semibold tabular-nums">{formatTime24(entry.item.startsAt)}</p>
                    <p className="text-xs">{minutesBetween(entry.item.startsAt, entry.item.endsAt)} min</p>
                  </div>
                  <p className="font-medium">Bloqueo · {entry.item.reason}</p>
                  <p className="ml-auto text-xs tabular-nums">{formatTimeRange(entry.item.startsAt, entry.item.endsAt)}</p>
                </li>
              ) : (
                <li
                  key={entry.item.id}
                  className={`flex flex-wrap items-center gap-4 px-5 py-4 ${entry.item.id === nextId ? 'bg-brand-50/60' : ''}`}
                >
                  <div className="w-16 shrink-0">
                    <p className="text-base font-semibold text-slate-900 tabular-nums">{formatTime24(entry.item.startsAt)}</p>
                    <p className="text-xs text-slate-500">{formatDuration(minutesBetween(entry.item.startsAt, entry.item.endsAt))}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.item.id === nextId && (
                        <StatusBadge tone="sky" dot={false} size="xs">
                          Siguiente
                        </StatusBadge>
                      )}
                      <p className="font-semibold text-slate-900">{entry.item.patient.fullName}</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {entry.item.service.name}
                      {entry.item.notes && <span className="text-slate-400"> · {entry.item.notes}</span>}
                    </p>
                  </div>
                  <StatusBadge status={entry.item.status} />
                  {(() => {
                    const action = actionFor(entry.item.status)
                    return (
                      <Button as={Link} to={dentistAttentionRoute(entry.item.id)} variant={action.variant} size="sm" icon={action.icon}>
                        {action.label}
                      </Button>
                    )
                  })()}
                </li>
              ),
            )}
          </ul>
        )}
      </Card>
    </PageContainer>
  )
}

export default DentistAgendaPage
