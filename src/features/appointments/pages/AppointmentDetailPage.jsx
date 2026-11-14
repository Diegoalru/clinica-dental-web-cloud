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
import Textarea from '@/components/ui/Textarea'
import { APPOINTMENT_STATUS, NOTIFICATION_TYPE_LABELS } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { STAFF_ROLES } from '@/constants/roles'
import { dentistsService } from '@/features/dentists/services/dentistsService'
import { useAuth } from '@/hooks/useAuth'
import { todayInClinic } from '@/utils/clinicTime'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateTimeLog, formatDayMonthYear, formatShortDate, formatTime24, formatTimeRange } from '@/utils/dateLabels'
import AppointmentLogTimeline from '../components/AppointmentLogTimeline'
import SlotPicker from '../components/SlotPicker'
import { appointmentsService } from '../services/appointmentsService'
import { toDisplayAppointment } from '../utils/appointmentMapper'

function Field({ label, value }) {
  return <div>
    <dt className="text-xs font-medium uppercase text-slate-500">{label}</dt>
    <dd className="mt-0.5 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
  </div>
}

/** Detalle y cambios reales de una cita; el API valida permisos y transiciones. */
function AppointmentDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const staff = STAFF_ROLES.includes(user.role)
  const back = staff ? ROUTES.RECEPTION_AGENDA : ROUTES.DENTIST_AGENDA
  const [detail, setDetail] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [version, setVersion] = useState(0)
  const [busy, setBusy] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newDentistId, setNewDentistId] = useState('')
  const [newTime, setNewTime] = useState(null)
  const [reason, setReason] = useState('')
  const [dentists, setDentists] = useState([])
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotVersion, setSlotVersion] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const serviceId = detail?.appointment.serviceId

  useEffect(() => {
    const controller = new AbortController()
    appointmentsService.getDetails(id, { signal: controller.signal })
      .then(async (result) => {
        const related = staff ? await appointmentsService.listAll(
          { patientId: result.appointment.patientId }, { signal: controller.signal }) : []
        if (!controller.signal.aborted) {
          setDetail(result)
          setHistory(related.filter((item) => item.id !== Number(id)).map(toDisplayAppointment))
          setError(null)
        }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [id, staff, version])

  useEffect(() => {
    if (!rescheduleOpen || !serviceId) return
    const controller = new AbortController()
    dentistsService.list({ serviceId }, { signal: controller.signal })
      .then((items) => { if (!controller.signal.aborted) setDentists(items) })
      .catch((failure) => { if (!controller.signal.aborted) setError(failure.message) })
    return () => controller.abort()
  }, [rescheduleOpen, serviceId])

  useEffect(() => {
    if (!rescheduleOpen || !serviceId || !newDentistId || !newDate) return
    const controller = new AbortController()
    appointmentsService.availability({
      dentistId: Number(newDentistId), serviceId, date: newDate,
    }, { signal: controller.signal })
      .then((items) => { if (!controller.signal.aborted) setSlots(items) })
      .catch((failure) => { if (!controller.signal.aborted) setError(failure.message) })
      .finally(() => { if (!controller.signal.aborted) setSlotsLoading(false) })
    return () => controller.abort()
  }, [rescheduleOpen, serviceId, newDentistId, newDate, slotVersion])

  useEffect(() => {
    const updateNow = () => { setNow(Date.now()); setVersion((v) => v + 1) }
    window.addEventListener('focus', updateNow)
    return () => window.removeEventListener('focus', updateNow)
  }, [])

  const appointment = detail ? toDisplayAppointment(detail.appointment) : null
  const isOpen = appointment && [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED].includes(appointment.status)
  const future = appointment && Date.parse(appointment.startsAt) > now
  const started = appointment && Date.parse(appointment.startsAt) <= now

  const changeStatus = async (status, remarks) => {
    setBusy(true)
    setError(null)
    try {
      await appointmentsService.changeStatus(id, status, remarks)
      setCancelOpen(false)
      setCancelReason('')
      setMessage('Estado actualizado en la base de datos.')
      setNow(Date.now())
      setVersion((v) => v + 1)
    } catch (failure) {
      setError(failure.message)
    } finally {
      setBusy(false)
    }
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
    setBusy(true)
    setError(null)
    try {
      await appointmentsService.reschedule(id, {
        date: newDate, time: newTime, dentistId: Number(newDentistId), remarks: reason,
      })
      setRescheduleOpen(false)
      setMessage('Cita reprogramada. Quedó pendiente de confirmación.')
      setVersion((v) => v + 1)
    } catch (failure) {
      setError(failure.message)
      if (failure.isConflict) { setNewTime(null); setSlotsLoading(true); setSlotVersion((v) => v + 1) }
    } finally {
      setBusy(false)
    }
  }

  const resend = async () => {
    setBusy(true)
    setError(null)
    try {
      await appointmentsService.resendConfirmation(id)
      setMessage('Confirmación agregada a la cola de notificaciones.')
      setVersion((v) => v + 1)
    } catch (failure) {
      setError(failure.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading && !detail) return <PageContainer><LoadingState label="Cargando cita…" /></PageContainer>
  if (!detail) return <PageContainer>
    <EmptyState icon="calendar" title="No se pudo abrir la cita" description={error ?? `No existe la cita #${id}.`}
      action={<Button as={Link} to={back} variant="secondary">Volver a la agenda</Button>} />
  </PageContainer>

  const { patient, logs, notifications } = detail
  return (
    <PageContainer>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: 'Agenda', to: back }, { label: `Cita #${id}` }]} />}
        title={<span className="flex flex-wrap items-center gap-3">{patient.fullName}<StatusBadge status={appointment.status} /></span>}
        description={`${formatShortDate(appointment.startsAt)} · ${formatTimeRange(appointment.startsAt, appointment.endsAt)} · ${appointment.service.name}`}
        actions={<div className="flex flex-wrap gap-2">
          {staff && appointment.status === APPOINTMENT_STATUS.PENDING && future &&
            <Button icon="check" disabled={busy} onClick={() => changeStatus(APPOINTMENT_STATUS.CONFIRMED)}>Confirmar</Button>}
          {staff && isOpen && future && <>
            <Button variant="secondary" disabled={busy} onClick={openReschedule}>Reprogramar</Button>
            <Button variant="danger-outline" disabled={busy} onClick={() => setCancelOpen(true)}>Cancelar</Button>
          </>}
          {!staff && appointment.status === APPOINTMENT_STATUS.CONFIRMED && started &&
            <Button disabled={busy} onClick={() => changeStatus(APPOINTMENT_STATUS.IN_PROGRESS)}>Iniciar atención</Button>}
          {!staff && appointment.status === APPOINTMENT_STATUS.IN_PROGRESS &&
            <Button disabled={busy} onClick={() => changeStatus(APPOINTMENT_STATUS.COMPLETED)}>Finalizar atención</Button>}
          {isOpen && started &&
            <Button variant="danger-outline" disabled={busy} onClick={() => changeStatus(APPOINTMENT_STATUS.NO_SHOW)}>No asistió</Button>}
        </div>}
      />
      {error && <Alert tone="error" title="No se pudo completar la acción">{error}</Alert>}
      {message && <Alert tone="success" onClose={() => setMessage(null)}>{message}</Alert>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card title="Datos de la cita">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Fecha y hora" value={`${formatShortDate(appointment.startsAt)} · ${formatTimeRange(appointment.startsAt, appointment.endsAt)}`} />
              <Field label="Odontólogo" value={appointment.dentist.displayName} />
              <Field label="Servicio" value={appointment.service.name} />
              <Field label="Precio de referencia" value={formatCurrency(appointment.priceSnapshot)} />
              <Field label="Paciente" value={patient.identification} />
              <Field label="Contacto" value={patient.phone} />
            </dl>
          </Card>
          {staff && rescheduleOpen && (
            <Card title="Reprogramar" description="Seleccione un horario disponible; la cita volverá a Pendiente.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nueva fecha" type="date" min={todayInClinic()} value={newDate}
                  onChange={(event) => { setNewDate(event.target.value); setNewTime(null); setSlots([]); setSlotsLoading(true) }} />
                <Select label="Odontólogo" value={newDentistId}
                  onChange={(event) => { setNewDentistId(event.target.value); setNewTime(null); setSlots([]); setSlotsLoading(true) }}
                  options={dentists.map((item) => ({ value: item.id, label: item.fullName }))} />
              </div>
              <div className="mt-4"><SlotPicker slots={slotsLoading ? [] : slots} value={newTime} onChange={setNewTime}
                columns={5} emptyMessage={slotsLoading ? 'Consultando horarios…' : 'No hay espacios para esta fecha.'} /></div>
              <Textarea label="Motivo del cambio" className="mt-4" rows={2} maxLength={480}
                value={reason} onChange={(event) => setReason(event.target.value)} />
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setRescheduleOpen(false)}>Descartar</Button>
                <Button disabled={!newTime || busy} loading={busy} onClick={saveReschedule}>Guardar cambio</Button>
              </div>
            </Card>
          )}
          <Card title="Bitácora"><AppointmentLogTimeline logs={logs} /></Card>
          {staff && <Card title="Historial del paciente">
            {history.length === 0 ? <p className="text-sm text-slate-500">Sin otras citas.</p> :
              <ul className="divide-y divide-slate-100">{history.map((item) =>
                <li key={item.id} className="flex justify-between gap-2 py-2 text-sm">
                  <span>{formatDayMonthYear(item.startsAt)} · {formatTime24(item.startsAt)} · {item.service.name}</span>
                  <StatusBadge status={item.status} />
                </li>)}</ul>}
          </Card>}
        </div>
        <div className="space-y-6">
          <Card title="Paciente">
            <dl className="space-y-3">
              <Field label="Nombre" value={patient.fullName} />
              <Field label="Identificación" value={patient.identification} />
              <Field label="Teléfono" value={patient.phone} />
              <Field label="Correo" value={patient.email} />
            </dl>
          </Card>
          <Card title="Notificaciones" actions={staff && isOpen && future &&
            <Button variant="secondary" size="sm" disabled={busy} onClick={resend}>Encolar confirmación</Button>}>
            {notifications.length === 0 ? <p className="text-sm text-slate-500">Sin notificaciones registradas.</p> :
              <ul className="space-y-3">{notifications.map((item) =>
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <span>{NOTIFICATION_TYPE_LABELS[item.type] ?? item.type} · {formatDateTimeLog(item.sentAt ?? item.scheduledFor)}</span>
                  <StatusBadge status={item.status} />
                </li>)}</ul>}
          </Card>
        </div>
      </div>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancelar cita" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setCancelOpen(false)}>Volver</Button>
          <Button variant="danger" disabled={!cancelReason.trim() || busy} loading={busy}
            onClick={() => changeStatus(APPOINTMENT_STATUS.CANCELLED, cancelReason)}>Cancelar cita</Button>
        </>}>
        <p className="text-sm text-slate-700">La cita quedará cancelada y el horario libre.</p>
        <Textarea label="Motivo *" className="mt-4" rows={3} maxLength={500}
          value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} />
      </Modal>
    </PageContainer>
  )
}

export default AppointmentDetailPage
