import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import Table, { Td, Th } from '@/components/ui/Table'
import Tabs from '@/components/ui/Tabs'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { formatDayMonthYear, formatTime24 } from '@/utils/dateLabels'
import { maskEmail } from '@/utils/privacy'
import AppointmentCard from '../components/AppointmentCard'
import { MOCK_TODAY, appointmentsByPatient } from '../mocks/appointments'

const HISTORY_FILTERS = [
  { value: 'ALL', label: 'Todos' },
  { value: APPOINTMENT_STATUS.COMPLETED, label: APPOINTMENT_STATUS_LABELS.COMPLETED },
  { value: APPOINTMENT_STATUS.CANCELLED, label: APPOINTMENT_STATUS_LABELS.CANCELLED },
  { value: APPOINTMENT_STATUS.NO_SHOW, label: APPOINTMENT_STATUS_LABELS.NO_SHOW },
]

const UPCOMING_STATUSES = [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED]

/** Mis citas (paciente): banner tras agendar, próximas citas e historial con filtro por estado. */
function MyAppointmentsPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [showCreated, setShowCreated] = useState(Boolean(location.state?.created))
  const [filter, setFilter] = useState('ALL')

  // TODO(api): appointmentsService.list({ patientId: user.patientId }). El mock usa el paciente 1 de ejemplo.
  const all = useMemo(() => appointmentsByPatient(user.patientId ?? 1), [user.patientId])
  const upcoming = all
    .filter((item) => UPCOMING_STATUSES.includes(item.status) && item.date >= MOCK_TODAY)
    .sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1))
  const history = all
    .filter((item) => !UPCOMING_STATUSES.includes(item.status) || item.date < MOCK_TODAY)
    .filter((item) => filter === 'ALL' || item.status === filter)
    .sort((a, b) => (a.startsAt < b.startsAt ? 1 : -1))

  return (
    <PageContainer>
      {showCreated && (
        <Alert tone="success" title="Cita solicitada" onClose={() => setShowCreated(false)}>
          Su cita quedó en estado <strong>Pendiente</strong>. Le enviamos un correo de confirmación a{' '}
          {maskEmail(user.email)} y recibirá un recordatorio antes de la cita.
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

      <section className="space-y-3" aria-label="Próximas citas">
        {upcoming.length === 0 ? (
          <Card>
            <EmptyState
              icon="calendar"
              title="No tiene citas próximas"
              description="Agende una cita para verla aquí."
              action={
                <Button as={Link} to={ROUTES.PATIENT_BOOK} icon="plus">
                  Agendar cita
                </Button>
              }
            />
          </Card>
        ) : (
          upcoming.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
        )}
        <Alert tone="info">
          ¿Necesita reprogramar o cancelar? Comuníquese con recepción al <strong>2222-0000</strong>. Los cambios
          se registran en la bitácora de la cita.
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
              <tr>
                <Th>Fecha</Th>
                <Th>Servicio</Th>
                <Th>Odontólogo</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {history.map((appointment) => (
                <tr key={appointment.id}>
                  <Td className="font-medium text-slate-900">
                    {formatDayMonthYear(appointment.startsAt)} · {formatTime24(appointment.startsAt)}
                  </Td>
                  <Td>{appointment.service.name}</Td>
                  <Td>{appointment.dentist.displayName}</Td>
                  <Td>
                    <StatusBadge status={appointment.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </PageContainer>
  )
}

export default MyAppointmentsPage
