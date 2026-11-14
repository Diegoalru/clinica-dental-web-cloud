import { Link } from 'react-router'
import Breadcrumb from '@/components/common/Breadcrumb'
import PageContainer from '@/components/common/PageContainer'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Card from '@/components/ui/Card'
import FormField from '@/components/ui/FormField'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import { ROUTES } from '@/constants/routes'
import { formatCurrency, formatDuration } from '@/utils/formatCurrency'
import { formatIsoDateShort } from '@/utils/dateLabels'
import { maskEmail } from '@/utils/privacy'
import SlotPicker from '../components/SlotPicker'
import { useReceptionBooking } from '../hooks/useReceptionBooking'

function StepTitle({ number, children }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
      <span className="flex size-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
        {number}
      </span>
      {children}
    </h2>
  )
}

/** Nueva cita (recepción). */
function NewAppointmentPage() {
  const booking = useReceptionBooking()

  return (
    <PageContainer>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: 'Agenda', to: ROUTES.RECEPTION_AGENDA }, { label: 'Nueva cita' }]} />}
        title="Nueva cita"
        description="Agende una cita para un paciente registrado."
      />

      {booking.error && <Alert tone="error" title="No se pudo completar la reserva">{booking.error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <StepTitle number={1}>Paciente</StepTitle>
            {booking.patient ? (
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-brand-200 bg-brand-50 p-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {booking.patient.fullName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{booking.patient.fullName}</p>
                  <p className="text-xs text-slate-600">
                    Céd. {booking.patient.identification} · {booking.patient.phone ?? '—'} · {maskEmail(booking.patient.email)}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={booking.clearPatient}>
                  Cambiar
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-3">
                  <SearchInput
                    value={booking.patientQuery}
                    onChange={booking.setPatientQuery}
                    placeholder="Buscar por nombre o identificación"
                    className="min-w-0 flex-1"
                  />
                </div>
                {booking.isLoadingPatients && <p className="text-sm text-slate-500">Buscando pacientes…</p>}
                {!booking.isLoadingPatients && booking.patientResults.length === 0 && (
                  <p className="text-sm text-slate-500">No se encontraron pacientes registrados.</p>
                )}
                {booking.patientResults.length > 0 && (
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {booking.patientResults.map((patient) => (
                      <li key={patient.id}>
                        <button
                          type="button"
                          onClick={() => booking.selectPatient(patient.id)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
                        >
                          <span>
                            <span className="block text-sm font-medium text-slate-900">{patient.fullName}</span>
                            <span className="block text-xs text-slate-500">Céd. {patient.identification}</span>
                          </span>
                          <Icon name="chevron-right" size={16} className="text-slate-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Card>

          <Card>
            <StepTitle number={2}>Servicio y odontólogo</StepTitle>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Select
                label="Servicio"
                placeholder={booking.isLoadingServices ? 'Cargando servicios…' : 'Seleccione un servicio'}
                value={booking.serviceId}
                onChange={(event) => booking.selectService(event.target.value)}
                options={booking.services.map((service) => ({
                  value: service.id,
                  label: `${service.name} · ${formatDuration(service.durationMinutes)}`,
                }))}
              />
              <Select
                label="Odontólogo (habilitados)"
                placeholder={booking.service ? 'Seleccione' : 'Primero el servicio'}
                value={booking.dentistId}
                disabled={!booking.service || booking.isLoadingDentists}
                onChange={(event) => booking.selectDentist(event.target.value)}
                options={booking.dentists.map((dentist) => ({ value: dentist.id, label: dentist.displayName }))}
              />
              <FormField
                label="Fecha"
                type="date"
                value={booking.date}
                onChange={(event) => booking.selectDate(event.target.value)}
                min={booking.today}
              />
            </div>
          </Card>

          <Card>
            <StepTitle number={3}>Horario disponible</StepTitle>
            <p className="mt-1 text-sm text-slate-500">
              Calculado con el horario semanal, bloqueos y citas existentes del odontólogo.
            </p>
            <div className="mt-4">
              {booking.dentist ? (
                <SlotPicker
                  slots={booking.isLoadingSlots ? [] : booking.slots}
                  value={booking.time}
                  onChange={booking.selectTime}
                  columns={5}
                  emptyMessage={booking.isLoadingSlots ? 'Consultando horarios…' : 'No hay espacios para esta fecha.'}
                />
              ) : (
                <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Elija servicio, odontólogo y fecha para ver los horarios.
                </p>
              )}
            </div>
          </Card>
        </div>

        <aside>
          <Card title="Resumen" className="lg:sticky lg:top-20">
            <dl className="space-y-3 text-sm">
              {[
                ['Paciente', booking.patient?.fullName],
                ['Servicio', booking.service?.name],
                ['Odontólogo', booking.dentist?.displayName],
                ['Fecha y hora', booking.time ? `${formatIsoDateShort(booking.date)} · ${booking.time} – ${booking.endTime}` : null],
                ['Precio de referencia', booking.service ? formatCurrency(booking.service.price) : null],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
                  <dd className={`mt-0.5 font-medium ${value ? 'text-slate-900' : 'text-slate-400'}`}>{value ?? 'Pendiente'}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-xs text-slate-500">
              La cita se crea en estado <strong>Pendiente</strong> y se registra en la bitácora.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Button icon="check" disabled={!booking.canSubmit} loading={booking.isSubmitting} onClick={booking.submit}>
                Agendar cita
              </Button>
              <Button as={Link} to={ROUTES.RECEPTION_AGENDA} variant="secondary">
                Cancelar
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </PageContainer>
  )
}

export default NewAppointmentPage
