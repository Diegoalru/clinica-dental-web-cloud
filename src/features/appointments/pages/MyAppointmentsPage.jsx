import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import LoadingState from '@/components/ui/LoadingState'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import Table, { Td, Th } from '@/components/ui/Table'
import Tabs from '@/components/ui/Tabs'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { parseClinicDate } from '@/utils/clinicTime'
import { formatDayMonthYear, formatTime24 } from '@/utils/dateLabels'
import AppointmentCard from '../components/AppointmentCard'
import { appointmentsService } from '../services/appointmentsService'
import { toDisplayAppointment } from '../utils/appointmentMapper'

const HISTORY_FILTERS = [
  { value: 'ALL', label: 'Todos' },
  { value: APPOINTMENT_STATUS.COMPLETED, label: APPOINTMENT_STATUS_LABELS.COMPLETED },
  { value: APPOINTMENT_STATUS.CANCELLED, label: APPOINTMENT_STATUS_LABELS.CANCELLED },
  { value: APPOINTMENT_STATUS.NO_SHOW, label: APPOINTMENT_STATUS_LABELS.NO_SHOW },
]

const UPCOMING_STATUSES = [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED]

function MyAppointmentsPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [showCreated, setShowCreated] = useState(Boolean(location.state?.created))
  const [filter, setFilter] = useState('ALL')
  // La hora se toma una vez al abrir la página (un render no debe leer el reloj)
  const [now] = useState(() => new Date())
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadVersion, setReloadVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    appointmentsService.listAll({ patientId: user.patientId }, { signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setAppointments(items.map(toDisplayAppointment))
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [user.patientId, reloadVersion])

  // Próxima: abierta y que todavía no termina (compara instantes, no solo la fecha)
  const isUpcoming = (item) => UPCOMING_STATUSES.includes(item.status) && parseClinicDate(item.endsAt) > now
  const upcoming = appointments
    .filter(isUpcoming)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const history = appointments
    .filter((item) => !isUpcoming(item))
    .filter((item) => filter === 'ALL' || item.status === filter)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt))

  return (
    <PageContainer>
      {showCreated && (
        <Alert tone="success" title="Cita solicitada" onClose={() => setShowCreated(false)}>
          Su cita quedó registrada en estado <strong>Pendiente</strong>.
        </Alert>
      )}

      <PageHeader
        eyebrow="Portal del paciente"
        title="Mis citas"
        description="Próximas citas e historial."
        actions={
          <Button as={Link} to={ROUTES.PATIENT_BOOK} icon="plus">
            Agendar nueva cita
          </Button>
        }
      />

      {error && (
        <Alert tone="error" title="No se pudieron cargar las citas">
          {error}{' '}
          <Button variant="link" onClick={() => { setError(null); setIsLoading(true); setReloadVersion((v) => v + 1) }}>
            Reintentar
          </Button>
        </Alert>
      )}

      {isLoading ? (
        <LoadingState label="Cargando sus citas…" />
      ) : !error && (
        <>
          <section className="space-y-3" aria-label="Próximas citas">
            {upcoming.length === 0 ? (
              <Card>
                <EmptyState
                  icon="calendar"
                  title="No tiene citas próximas"
                  description="Agende una cita para verla aquí."
                  action={<Button as={Link} to={ROUTES.PATIENT_BOOK} icon="plus">Agendar cita</Button>}
                />
              </Card>
            ) : (
              upcoming.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
            )}
            <Alert tone="info">
              ¿Necesita reprogramar o cancelar? Comuníquese con recepción al <strong>2222-0000</strong>.
            </Alert>
          </section>

          <Card
            title="Historial"
            padding={false}
            actions={<Tabs variant="pills" items={HISTORY_FILTERS} value={filter} onChange={setFilter} label="Filtrar historial por estado" />}
          >
            {history.length === 0 ? (
              <EmptyState title="Sin citas en el historial" description="Aquí aparecerán las citas pasadas." />
            ) : (
              <Table>
                <thead>
                  <tr><Th>Fecha</Th><Th>Servicio</Th><Th>Odontólogo</Th><Th>Estado</Th></tr>
                </thead>
                <tbody>
                  {history.map((appointment) => (
                    <tr key={appointment.id}>
                      <Td className="font-medium text-slate-900">
                        {formatDayMonthYear(appointment.startsAt)} · {formatTime24(appointment.startsAt)}
                      </Td>
                      <Td>{appointment.service.name}</Td>
                      <Td>{appointment.dentist.displayName}</Td>
                      <Td><StatusBadge status={appointment.status} /></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </PageContainer>
  )
}

export default MyAppointmentsPage
