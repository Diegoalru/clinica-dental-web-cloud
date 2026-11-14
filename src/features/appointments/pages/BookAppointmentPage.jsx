import Alert from '@/components/ui/Alert'
import PageContainer from '@/components/common/PageContainer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import PageHeader from '@/components/ui/PageHeader'
import Stepper from '@/components/ui/Stepper'
import { formatCurrency, formatDuration } from '@/utils/formatCurrency'
import { formatIsoDateShort } from '@/utils/dateLabels'
import BookingSummary from '../components/BookingSummary'
import DatePicker from '../components/DatePicker'
import OptionCard from '../components/OptionCard'
import SlotPicker from '../components/SlotPicker'
import { useBookingWizard } from '../hooks/useBookingWizard'

/**
 * Agendar cita (paciente). En escritorio se ven los tres paneles a la vez (wireframe 02);
 * en móvil se muestra un paso a la vez con "Paso N de 4" (wireframe 03).
 */
function BookAppointmentPage() {
  const wizard = useBookingWizard()
  const { step, steps } = wizard

  // En móvil solo el panel del paso actual es visible; en md+ todos
  const panel = (number) => (step === number ? '' : 'hidden md:block')

  // En escritorio no hay "Continuar": el avance del indicador sale de lo que ya se eligió
  const reached = !wizard.service ? 1 : !wizard.dentist ? 2 : !wizard.time ? 3 : 4

  const summaryItems = [
    { label: 'Servicio', value: wizard.service?.name },
    { label: 'Odontólogo', value: wizard.dentist?.displayName },
    {
      label: 'Fecha y hora',
      value: wizard.time ? `${formatIsoDateShort(wizard.date)} · ${wizard.time} – ${wizard.endTime}` : null,
    },
    { label: 'Precio de referencia', value: wizard.service ? formatCurrency(wizard.service.price) : null },
  ]

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Portal del paciente"
        title="Agendar una cita"
        description="Elija el servicio, el odontólogo y un horario disponible."
      />

      {wizard.error && <Alert tone="error" title="No se pudo completar la reserva">{wizard.error}</Alert>}

      {/* Indicador de pasos: completo en escritorio, compacto en móvil */}
      <Card className="hidden md:block" padding={false}>
        <div className="px-5 py-4">
          <Stepper steps={steps} current={reached} />
        </div>
      </Card>
      <div className="flex items-center justify-between md:hidden">
        <p className="text-sm font-medium text-slate-500">
          Paso {step} de {steps.length}
        </p>
        <p className="text-sm font-semibold text-slate-900">{steps[step - 1]}</p>
      </div>

      {/* Resumen compacto de lo ya elegido (móvil) */}
      {step > 1 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm md:hidden">
          <span className="font-medium text-slate-900">{wizard.service?.name}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600">{formatDuration(wizard.service?.durationMinutes)}</span>
          {wizard.dentist && (
            <>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">{wizard.dentist.displayName}</span>
            </>
          )}
          <Button variant="link" className="ml-auto" onClick={() => wizard.goTo(1)}>
            Cambiar
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="space-y-6">
          <Card title="1. Servicio" className={panel(1)}>
            <div className="space-y-2">
              {wizard.isLoadingServices && <p className="text-sm text-slate-500">Cargando servicios…</p>}
              {wizard.services.map((service) => (
                <OptionCard
                  key={service.id}
                  selected={service.id === wizard.service?.id}
                  onClick={() => wizard.selectService(service.id)}
                  title={service.name}
                  detail={`${formatDuration(service.durationMinutes)} · ${formatCurrency(service.price)}`}
                  icon="tooth"
                />
              ))}
            </div>
          </Card>

          <Card
            title="2. Odontólogo"
            description={
              wizard.service
                ? `Solo se muestran profesionales habilitados para «${wizard.service.name}».`
                : 'Primero elija un servicio.'
            }
            className={panel(2)}
          >
            <div className="space-y-2">
              {wizard.dentists.map((dentist) => (
                <OptionCard
                  key={dentist.id}
                  selected={dentist.id === wizard.dentist?.id}
                  onClick={() => wizard.selectDentist(dentist.id)}
                  title={dentist.displayName}
                  detail={dentist.specialty}
                  initial={dentist.fullName.charAt(0)}
                  round
                />
              ))}
              {wizard.isLoadingDentists && <p className="text-sm text-slate-500">Cargando odontólogos…</p>}
              {wizard.service && !wizard.isLoadingDentists && wizard.dentists.length === 0 && (
                <p className="text-sm text-slate-500">No hay odontólogos para este servicio.</p>
              )}
            </div>
          </Card>
        </div>

        <Card title="3. Fecha y hora" className={panel(3)}>
          {!wizard.dentist ? (
            <p className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Elija un servicio y un odontólogo para ver los horarios disponibles.
            </p>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <DatePicker
                  value={wizard.date}
                  onChange={wizard.selectDate}
                  minDate={wizard.today}
                />
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900">
                    {formatIsoDateShort(wizard.date)} · {wizard.dentist.displayName}
                  </p>
                  {wizard.isLoadingSlots && <p className="mb-3 text-sm text-slate-500">Consultando horarios…</p>}
                  <SlotPicker
                    slots={wizard.isLoadingSlots ? [] : wizard.slots}
                    value={wizard.time}
                    onChange={wizard.selectTime}
                    emptyMessage={wizard.isLoadingSlots ? 'Consultando horarios…' : 'No hay espacios para este día.'}
                  />
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-3 rounded-sm border border-slate-300 bg-white" aria-hidden="true" />
                      Disponible
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-3 rounded-sm bg-brand-600" aria-hidden="true" />
                      Seleccionado
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-3 rounded-sm border border-dashed border-slate-400 bg-stripes" aria-hidden="true" />
                      Ocupado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Paso 4 en móvil: solo el resumen. En escritorio el resumen siempre está abajo. */}
      <BookingSummary
        className={step === 4 ? '' : 'hidden md:block'}
        items={summaryItems}
        actions={
          <Button
            icon="check"
            onClick={wizard.confirm}
            disabled={!wizard.time || wizard.isSubmitting}
            loading={wizard.isSubmitting}
            className="hidden md:inline-flex"
          >
            Confirmar cita
          </Button>
        }
      />

      {/* Barra de acciones móvil (un paso a la vez) */}
      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        {step > 1 && (
          <Button variant="secondary" onClick={wizard.back} icon="arrow-left">
            Atrás
          </Button>
        )}
        <div className="min-w-0 flex-1 text-sm">
          {wizard.time ? (
            <>
              <p className="truncate font-semibold text-slate-900">
                {formatIsoDateShort(wizard.date)} · {wizard.time}
              </p>
              <p className="text-slate-500">{formatCurrency(wizard.service?.price)}</p>
            </>
          ) : (
            <p className="text-slate-500">{steps[step - 1]}</p>
          )}
        </div>
        {step < steps.length ? (
          <Button onClick={wizard.next} disabled={!wizard.canContinue}>
            Continuar
          </Button>
        ) : (
          <Button icon="check" onClick={wizard.confirm} disabled={!wizard.time || wizard.isSubmitting} loading={wizard.isSubmitting}>
            Confirmar
          </Button>
        )}
      </div>
    </PageContainer>
  )
}

export default BookAppointmentPage
