import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Breadcrumb from '@/components/common/Breadcrumb'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import Tabs from '@/components/ui/Tabs'
import Textarea from '@/components/ui/Textarea'
import { APPOINTMENT_STATUS, NOTIFICATION_TYPE_LABELS } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { formatCurrency, formatDuration } from '@/utils/formatCurrency'
import { formatDateTimeLog, formatDayMonthYear, formatShortDate, formatTime24, formatTimeRange } from '@/utils/dateLabels'
import { dentistsForService } from '@/features/dentists/mocks/dentists'
import AppointmentLogTimeline from '../components/AppointmentLogTimeline'
import SlotPicker from '../components/SlotPicker'
import {
  appointmentLogs,
  appointmentNotifications,
  appointmentsByPatient,
  findAppointment,
  getAvailability,
} from '../mocks/appointments'

const TABS = [
  { value: 'logs', label: 'Bitácora' },
  { value: 'history', label: 'Historial del paciente' },
]

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
    </div>
  )
}

/** Detalle de cita (recepción): datos, reprogramar, cancelar, notificaciones y bitácora. */
function AppointmentDetailPage() {
  const { id } = useParams()
  // TODO(api): appointmentsService.get(id)
  const appointment = findAppointment(id)

  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [tab, setTab] = useState('logs')
  const [newDate, setNewDate] = useState(appointment?.date ?? '')
  const [newDentistId, setNewDentistId] = useState(appointment ? String(appointment.dentist.id) : '')
  const [newTime, setNewTime] = useState(null)
  const [reason, setReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [cancelError, setCancelError] = useState(null)
  const [message, setMessage] = useState(null)

  if (!appointment) {
    return (
      <PageContainer>
        <EmptyState
          icon="calendar"
          title="Cita no encontrada"
          description={`No existe la cita #${id}.`}
          action={
            <Button as={Link} to={ROUTES.RECEPTION_AGENDA} variant="secondary" icon="arrow-left">
              Volver a la agenda
            </Button>
          }
        />
      </PageContainer>
    )
  }

  const { patient, dentist, service } = appointment
  const logs = appointmentLogs[appointment.id] ?? []
  const notifications = appointmentNotifications[appointment.id] ?? []
  const history = appointmentsByPatient(patient.id).filter((item) => item.id !== appointment.id)
  const isOpen = [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED].includes(appointment.status)
  const slots = newDentistId && newDate ? getAvailability(newDentistId, newDate) : []

  const confirmCancel = () => {
    if (!cancelReason.trim()) {
      setCancelError('Indique el motivo de la cancelación.')
      return
    }
    // TODO(api): appointmentsService.cancel(appointment.id, cancelReason)
    setCancelOpen(false)
    setMessage('Cita cancelada. Se envió el correo de cancelación y se registró en la bitácora.')
  }

  const saveReschedule = () => {
    // TODO(api): appointmentsService.reschedule(appointment.id, { date: newDate, time: newTime, dentistId: newDentistId, remarks: reason })
    setRescheduleOpen(false)
    setMessage('Cambio guardado. El recordatorio pendiente se reprogramó y se envió un nuevo correo de confirmación.')
  }

  return (
    <PageContainer>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: 'Agenda', to: ROUTES.RECEPTION_AGENDA }, { label: `Cita #${appointment.id}` }]} />}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {patient.fullName}
            <StatusBadge status={appointment.status} />
          </span>
        }
        description={`${formatShortDate(appointment.startsAt)} · ${formatTimeRange(appointment.startsAt, appointment.endsAt)} · ${service.name}`}
        actions={
          isOpen && (
            <>
              {appointment.status === APPOINTMENT_STATUS.PENDING && (
                // TODO(api): appointmentsService.confirm(appointment.id)
                <Button icon="check" onClick={() => setMessage('Cita confirmada.')}>
                  Confirmar
                </Button>
              )}
              <Button variant="secondary" icon="refresh" onClick={() => setRescheduleOpen((open) => !open)}>
                Reprogramar
              </Button>
              <Button variant="danger-outline" icon="x" onClick={() => setCancelOpen(true)}>
                Cancelar cita
              </Button>
            </>
          )
        }
      />

      {message && (
        <Alert tone="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card title="Datos de la cita">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Fecha y hora" value={`${formatShortDate(appointment.startsAt)} · ${formatTimeRange(appointment.startsAt, appointment.endsAt)}`} />
              <Field label="Odontólogo" value={dentist.displayName} />
              <Field label="Servicio" value={`${service.name} · ${formatDuration(service.durationMinutes)}`} />
              <Field label="Precio de referencia" value={formatCurrency(appointment.priceSnapshot)} />
              <Field label="Paciente" value={`Céd. ${patient.identification}`} />
              <Field label="Contacto" value={patient.phone} />
              {appointment.notes && <Field label="Observaciones" value={appointment.notes} />}
            </dl>
          </Card>

          {rescheduleOpen && (
            <Card title="Reprogramar" description="Elija la nueva fecha, el odontólogo y un horario libre.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Nueva fecha"
                  type="date"
                  value={newDate}
                  onChange={(event) => {
                    setNewDate(event.target.value)
                    setNewTime(null)
                  }}
                />
                <Select
                  label="Odontólogo"
                  value={newDentistId}
                  onChange={(event) => {
                    setNewDentistId(event.target.value)
                    setNewTime(null)
                  }}
                  options={dentistsForService(service.id).map((item) => ({ value: item.id, label: item.displayName }))}
                />
              </div>
              <div className="mt-4">
                <SlotPicker slots={slots} value={newTime} onChange={setNewTime} columns={5} />
              </div>
              <Textarea
                label="Motivo del cambio"
                className="mt-4"
                rows={2}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
              <p className="mt-3 text-xs text-slate-500">
                El recordatorio pendiente se reprograma y se envía un nuevo correo de confirmación.
              </p>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button variant="secondary" onClick={() => setRescheduleOpen(false)}>
                  Descartar
                </Button>
                <Button icon="check" disabled={!newTime} onClick={saveReschedule}>
                  Guardar cambio
                </Button>
              </div>
            </Card>
          )}

          <Card padding={false} title={tab === 'logs' ? 'Bitácora' : 'Historial del paciente'} actions={<Tabs variant="pills" items={TABS} value={tab} onChange={setTab} label="Sección" />}>
            <div className="p-5">
              {tab === 'logs' ? (
                <>
                  <AppointmentLogTimeline logs={logs} />
                  <p className="mt-4 text-xs text-slate-500">
                    Cada cambio guarda: estado anterior, estado nuevo, usuario, fecha y observación.
                  </p>
                </>
              ) : history.length === 0 ? (
                <p className="text-sm text-slate-500">El paciente no tiene otras citas.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                      <span>
                        <span className="font-medium text-slate-900">
                          {formatDayMonthYear(item.startsAt)} · {formatTime24(item.startsAt)}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {item.service.name} · {item.dentist.displayName}
                        </span>
                      </span>
                      <StatusBadge status={item.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title="Notificaciones"
            actions={
              // TODO(api): appointmentsService.resendConfirmation(appointment.id)
              <Button variant="secondary" size="sm" icon="send" onClick={() => setMessage('Confirmación reenviada.')}>
                Reenviar confirmación
              </Button>
            }
          >
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">Sin notificaciones registradas.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li key={notification.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{NOTIFICATION_TYPE_LABELS[notification.type]}</p>
                      <p className="text-xs text-slate-500">
                        {notification.sentAt
                          ? `Correo · ${formatDateTimeLog(notification.sentAt)}`
                          : `Programado · ${formatDateTimeLog(notification.scheduledFor)}`}
                      </p>
                    </div>
                    <StatusBadge status={notification.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Paciente">
            <dl className="space-y-3">
              <Field label="Nombre" value={patient.fullName} />
              <Field label="Identificación" value={patient.identification} />
              <Field label="Teléfono" value={patient.phone} />
              <Field label="Correo" value={patient.email} />
            </dl>
          </Card>
        </div>
      </div>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancelar cita"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>
              Volver
            </Button>
            <Button variant="danger" onClick={confirmCancel}>
              Sí, cancelar cita
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700">
          ¿Cancelar la cita de <strong>{patient.fullName}</strong> del {formatShortDate(appointment.startsAt)} a las{' '}
          {formatTime24(appointment.startsAt)}? El espacio quedará libre y se enviará un correo de cancelación.
        </p>
        <Textarea
          label="Motivo de cancelación *"
          className="mt-4"
          rows={3}
          value={cancelReason}
          error={cancelError}
          onChange={(event) => {
            setCancelReason(event.target.value)
            setCancelError(null)
          }}
        />
      </Modal>
    </PageContainer>
  )
}

export default AppointmentDetailPage
