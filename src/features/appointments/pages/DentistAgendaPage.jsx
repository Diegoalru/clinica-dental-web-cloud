import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import LoadingState from '@/components/ui/LoadingState'
import PageHeader from '@/components/ui/PageHeader'
import Stat from '@/components/ui/Stat'
import StatusBadge from '@/components/ui/StatusBadge'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'
import { dentistAttentionRoute } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { todayInClinic } from '@/utils/clinicTime'
import { addDays, formatIsoDateShort, formatTime24, startOfWeek } from '@/utils/dateLabels'
import { formatDuration } from '@/utils/formatCurrency'
import WeekStrip from '../components/WeekStrip'
import { appointmentsService } from '../services/appointmentsService'
import { toDisplayAppointment } from '../utils/appointmentMapper'

const OPEN_STATUSES = [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED]

/** Agenda real del odontólogo; el API solo entrega sus propias citas. */
function DentistAgendaPage() {
  const { user } = useAuth()
  const [date, setDate] = useState(todayInClinic)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)
  const weekStart = startOfWeek(date)

  useEffect(() => {
    const controller = new AbortController()
    appointmentsService.listAll({
      from: `${weekStart}T00:00:00`,
      to: `${addDays(weekStart, 7)}T00:00:00`,
    }, { signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) { setAppointments(items.map(toDisplayAppointment)); setError(null) }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [weekStart, version])

  useEffect(() => {
    const refresh = () => { setLoading(true); setVersion((v) => v + 1) }
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  const dayItems = useMemo(() => appointments.filter((item) => item.date === date)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt)), [appointments, date])
  const count = (statuses) => dayItems.filter((item) => statuses.includes(item.status)).length

  return (
    <PageContainer>
      <PageHeader eyebrow={user.fullName} title={`Mi agenda · ${formatIsoDateShort(date)}`}
        description="Citas registradas para esta semana." />
      {error && (
        <Alert tone="error" title="No se pudo cargar la agenda">
          {error} <Button variant="link" onClick={() => setVersion((v) => v + 1)}>Reintentar</Button>
        </Alert>
      )}
      <Card padding={false}>
        <div className="px-4 py-3">
          <WeekStrip value={date} today={todayInClinic()} onChange={(value) => { setLoading(true); setDate(value) }}
            countFor={(iso) => appointments.filter((item) => item.date === iso).length} />
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Citas del día" value={dayItems.length} />
        <Stat label="Atendidas" value={count([APPOINTMENT_STATUS.COMPLETED])} tone="emerald" />
        <Stat label="No asistió" value={count([APPOINTMENT_STATUS.NO_SHOW])} tone="rose" />
        <Stat label="Por atender" value={count(OPEN_STATUSES)} tone="sky" />
      </div>
      <Card title="Citas del día" padding={false}>
        {loading ? <LoadingState label="Cargando citas…" /> : !error && (
          dayItems.length === 0 ? (
            <EmptyState icon="calendar" title="Sin citas este día" description="Elija otro día de la semana." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {dayItems.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="w-16 shrink-0">
                    <p className="text-base font-semibold tabular-nums">{formatTime24(item.startsAt)}</p>
                    <p className="text-xs text-slate-500">{formatDuration(item.service.durationMinutes)}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{item.patient.fullName}</p>
                    <p className="text-sm text-slate-600">{item.service.name}</p>
                  </div>
                  <StatusBadge status={item.status} />
                  <Button as={Link} to={dentistAttentionRoute(item.id)} variant="secondary" size="sm">Ver cita</Button>
                </li>
              ))}
            </ul>
          )
        )}
      </Card>
    </PageContainer>
  )
}

export default DentistAgendaPage
