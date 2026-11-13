import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { addMinutes } from '@/utils/dateLabels'
import { dentistsForService } from '@/features/dentists/mocks/dentists'
import { services } from '@/features/services/mocks/services'
import { ENTITY_STATUS } from '@/constants/appointmentStatus'
import { MOCK_TODAY, alternativeSlots, dentistWorksOn, getAvailability } from '../mocks/appointments'

export const BOOKING_STEPS = ['Servicio', 'Odontólogo', 'Fecha y hora', 'Confirmar']

/**
 * Estado del asistente de agendamiento del paciente (4 pasos). Solo lógica de pantalla:
 * qué se eligió, qué paso sigue y si se puede continuar.
 *
 * TODO(api): services → servicesService.list({ status: 'ACTIVE' }); dentists → dentistsService.list({ serviceId });
 * slots → appointmentsService.availability(); confirm → appointmentsService.create().
 */
export function useBookingWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState(null)
  const [dentistId, setDentistId] = useState(null)
  const [date, setDate] = useState(MOCK_TODAY)
  const [time, setTime] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeServices = useMemo(() => services.filter((service) => service.status === ENTITY_STATUS.ACTIVE), [])
  const service = activeServices.find((item) => item.id === serviceId) ?? null
  const dentists = useMemo(() => (serviceId ? dentistsForService(serviceId) : []), [serviceId])
  const dentist = dentists.find((item) => item.id === dentistId) ?? null
  const slots = useMemo(() => (dentistId && date ? getAvailability(dentistId, date) : []), [dentistId, date])
  const endTime = service && time ? addMinutes(time, service.durationMinutes) : null

  const selectService = (id) => {
    setServiceId(id)
    // Al cambiar de servicio puede que el odontólogo ya no esté habilitado
    setDentistId(null)
    setTime(null)
  }

  const selectDentist = (id) => {
    setDentistId(id)
    setTime(null)
  }

  const selectDate = (iso) => {
    setDate(iso)
    setTime(null)
  }

  const selectAlternative = (slot) => {
    setDentistId(slot.dentistId)
    setDate(slot.date)
    setTime(slot.time)
  }

  const canContinue = {
    1: serviceId !== null,
    2: dentistId !== null,
    3: time !== null,
    4: true,
  }[step]

  const next = () => setStep((current) => Math.min(current + 1, BOOKING_STEPS.length))
  const back = () => setStep((current) => Math.max(current - 1, 1))
  const goTo = (target) => setStep(target)

  const confirm = async () => {
    setIsSubmitting(true)
    try {
      // TODO(api): await appointmentsService.create({ patientId: user.patientId, dentistId, serviceId, date, time })
      // El API crea la cita en PENDING, guarda el precio de referencia, registra la bitácora y envía el correo.
      navigate(ROUTES.PATIENT_APPOINTMENTS, { state: { created: true } })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    steps: BOOKING_STEPS,
    services: activeServices,
    dentists,
    slots,
    alternatives: alternativeSlots,
    service,
    dentist,
    date,
    time,
    endTime,
    canContinue,
    isSubmitting,
    isDayDisabled: (iso) => (dentistId ? !dentistWorksOn(dentistId, iso) : false),
    selectService,
    selectDentist,
    selectDate,
    selectTime: setTime,
    selectAlternative,
    next,
    back,
    goTo,
    confirm,
  }
}
