import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import Breadcrumb from '@/components/common/Breadcrumb'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import FormField from '@/components/ui/FormField'
import LoadingState from '@/components/ui/LoadingState'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import Tabs from '@/components/ui/Tabs'
import Textarea from '@/components/ui/Textarea'
import { APPOINTMENT_STATUS, NOTIFICATION_TYPE_LABELS } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { dentistsService } from '@/features/dentists/services/dentistsService'
import { todayInClinic } from '@/utils/clinicTime'
import { formatCurrency, formatDuration } from '@/utils/formatCurrency'
import { formatDateTimeLog, formatDayMonthYear, formatShortDate, formatTime24, formatTimeRange } from '@/utils/dateLabels'
import AppointmentLogTimeline from '../components/AppointmentLogTimeline'
import SlotPicker from '../components/SlotPicker'
import { useAppointmentDetail } from '../hooks/useAppointmentDetail'
import { hasStarted } from '../utils/appointmentMapper'

const TABS = [
  { value: 'logs', label: 'Bitácora' },
  { value: 'history', label: 'Historial del paciente' },
]

const OPEN_STATUSES = [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED]

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
    </div>
  )
}

/** Detalle de cita (recepción): datos, confirmar, cancelar, marcar que no asistió, notificaciones y bitácora. */
function AppointmentDetailPage() {
  const { id } = useParams()
  const detail = useAppointmentDetail(id)
  const { appointment, history, setExternalError } = detail

  const [cancelOpen, setCancelOpen] = useState(false)
  const [tab, setTab] = useState('logs')
  const [cancelReason, setCancelReason] = useState('')
  const [cancelError, setCancelError] = useState(null)
  const [message, setMessage] = useState(null)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newDentistId, setNewDentistId] = useState('')
  const [newTime, setNewTime] = useState(null)
  const [reason, setReason] = useState('')
  const [dentists, setDentists] = useState([])
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const serviceId = appointment?.service?.id
  useEffect(() => {
    if (!rescheduleOpen || !serviceId) return
    const controller = new AbortController()
    dentistsService.list({ serviceId }, { signal: controller.signal })
      .then((items) => { if (!controller.signal.aborted) setDentists(items) })
      .catch((failure) => { if (!controller.signal.aborted) setExternalError(failure.message) })
    return () => controller.abort()
  }, [rescheduleOpen, serviceId, setExternalError])

  useEffect(() => {
    if (!rescheduleOpen || !serviceId || !newDentistId || !newDate) return
    const controller = new AbortController()
    appointmentsService.availability({ dentistId: Number(newDentistId), serviceId, date: newDate },
      { signal: controller.signal })
      .then((items) => { if (!controller.signal.aborted) setSlots(items) })
      .catch((failure) => { if (!controller.signal.aborted) setExternalError(failure.message) })
      .finally(() => { if (!controller.signal.aborted) setSlotsLoading(false) })
    return () => controller.abort()
  }, [rescheduleOpen, serviceId, newDentistId, newDate, setExternalError])

  if (detail.isLoading) {
    return (
      <PageContainer>
        <LoadingState label="Cargando la cita…" />
      </PageContainer>
    )
  }

  if (!appointment) {
    return (
      <PageContainer>
        {detail.error && <Alert tone="error">{detail.error}</Alert>}
        <EmptyState
          icon="calendar"
          title="Cita no encontrada"
          description={detail.notFound ? `No existe la cita #${id}.` : 'No se pudo cargar la cita.'}
          action={
            <Button as={Link} to={ROUTES.RECEPTION_AGENDA} variant="secondary" icon="arrow-left">
              Volver a la agenda
            </Button>
          }
        />
      </PageContainer>
    )
  }

  const { patient, dentist, service, logs, notifications } = appointment
  const isOpen = OPEN_STATUSES.includes(appointment.status)
  const started = hasStarted(appointment)

  const run = async (action, successMessage) => {
    setMessage(null)
    if (await action()) setMessage(successMessage)
  }

  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError('Indique el motivo de la cancelación.')
      return
    }
    setCancelOpen(false)
    await run(() => detail.cancel(cancelReason.trim()), 'Cita cancelada. El espacio quedó libre y se registró en la bitácora.')
    setCancelReason('')
  }

  const openReschedule = () => {
    setNewDate(appointment.date)
    setNewDentistId(String(appointment.dentist.id))
    setNewTime(null)
    setSlots([])
    setSlotsLoading(true)
    setReason('')
    setRescheduleOpen(true)
  }

  const saveReschedule = async () => {
    if (!newTime) return
    if (await detail.reschedule({ date: newDate, time: newTime, dentistId: Number(newDentistId), remarks: reason })) {
      setRescheduleOpen(false)
      setMessage('Cita reprogramada. Quedó pendiente de confirmación.')
    } else {
      setNewTime(null)
      setSlots([])
    }
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
              {appointment.status === APPOINTMENT_STATUS.PENDING && !started && (
                <Button icon="check" loading={detail.isSaving} onClick={() => run(detail.confirm, 'Cita confirmada.')}>
                  Confirmar
                </Button>
              )}
              {!started && (
                <Button variant="secondary" disabled={detail.isSaving} onClick={openReschedule}>
                  Reprogramar
                </Button>
              )}
              {started ? (
                <Button
                  variant="secondary"
                  icon="x"
                  loading={detail.isSaving}
                  onClick={() => run(detail.markNoShow, 'Se registró que el paciente no asistió.')}
                >
                  No asistió
                </Button>
              ) : (
                <Button variant="danger-outline" icon="x" disabled={detail.isSaving} onClick={() => setCancelOpen(true)}>
                  Cancelar cita
                </Button>
              )}
            </>
          )
        }
      />

      {message && (
        <Alert tone="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}
      {detail.error && (
        <Alert tone="error" title="No se pudo guardar el cambio" onClose={detail.clearError}>
          {detail.error}
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
            </dl>
          </Card>

          {rescheduleOpen && (
            <Card title="Reprogramar" description="Seleccione un horario disponible; la cita volverá a Pendiente.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nueva fecha" type="date" min={todayInClinic()} value={newDate}
                  onChange={(event) => { setNewDate(event.target.value); setNewTime(null); setSlots([]); setSlotsLoading(true) }} />
                <Select label="Odontólogo" value={newDentistId}
                  onChange={(event) => { setNewDentistId(event.target.value); setNewTime(null); setSlots([]); setSlotsLoading(true) }}
                  options={dentists.map((item) => ({ value: item.id, label: item.fullName }))} />
              </div>
              <div className="mt-4">
                <SlotPicker slots={slotsLoading ? [] : slots} value={newTime} onChange={setNewTime}
                  columns={5} emptyMessage={slotsLoading ? 'Consultando horarios…' : 'No hay espacios para esta fecha.'} />
              </div>
              <Textarea label="Motivo del cambio" className="mt-4" rows={2} maxLength={480}
                value={reason} onChange={(event) => setReason(event.target.value)} />
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setRescheduleOpen(false)}>Descartar</Button>
                <Button disabled={!newTime || detail.isSaving} loading={detail.isSaving} onClick={saveReschedule}>
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
          <Card title="Notificaciones" actions={isOpen && !started &&
            <Button variant="secondary" size="sm" disabled={detail.isSaving}
              onClick={() => run(detail.resendConfirmation, 'Confirmación agregada a la cola de notificaciones.')}>
              Encolar confirmación
            </Button>}>
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">Sin notificaciones registradas.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li key={notification.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{NOTIFICATION_TYPE_LABELS[notification.type] ?? notification.type}</p>
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
          {formatTime24(appointment.startsAt)}? El espacio quedará libre para otro paciente.
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
