import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { dentistsService } from '@/features/dentists/services/dentistsService'
import { servicesService } from '@/features/services/services/servicesService'
import { useAuth } from '@/hooks/useAuth'
import { todayInClinic } from '@/utils/clinicTime'
import { addMinutes } from '@/utils/dateLabels'
import { appointmentsService } from '../services/appointmentsService'

export const BOOKING_STEPS = ['Servicio', 'Odontólogo', 'Fecha y hora', 'Confirmar']

export function useBookingWizard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [dentists, setDentists] = useState([])
  const [slots, setSlots] = useState([])
  const [serviceId, setServiceId] = useState(null)
  const [dentistId, setDentistId] = useState(null)
  const [date, setDate] = useState(todayInClinic)
  const [time, setTime] = useState(null)
  const [availabilityVersion, setAvailabilityVersion] = useState(0)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [isLoadingDentists, setIsLoadingDentists] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    servicesService.list(undefined, { signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setServices(items)
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingServices(false)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!serviceId) return
    const controller = new AbortController()
    dentistsService.list({ serviceId }, { signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setDentists(items.map((item) => ({ ...item, displayName: item.fullName })))
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingDentists(false)
      })
    return () => controller.abort()
  }, [serviceId])

  useEffect(() => {
    if (!dentistId || !serviceId || !date) return
    const controller = new AbortController()
    appointmentsService.availability({ dentistId, serviceId, date }, { signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setSlots(items)
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingSlots(false)
      })
    return () => controller.abort()
  }, [dentistId, serviceId, date, availabilityVersion])

  const service = useMemo(() => services.find((item) => item.id === serviceId) ?? null, [services, serviceId])
  const dentist = useMemo(() => dentists.find((item) => item.id === dentistId) ?? null, [dentists, dentistId])
  const endTime = service && time ? addMinutes(time, service.durationMinutes) : null

  const selectService = (id) => {
    if (id === serviceId) return
    setServiceId(id)
    setDentistId(null)
    setDentists([])
    setSlots([])
    setTime(null)
    setError(null)
    setIsLoadingDentists(true)
  }

  const selectDentist = (id) => {
    if (id === dentistId) return
    setDentistId(id)
    setSlots([])
    setTime(null)
    setError(null)
    setIsLoadingSlots(true)
  }

  const selectDate = (iso) => {
    if (iso === date) return
    setDate(iso)
    setSlots([])
    setTime(null)
    setError(null)
    setIsLoadingSlots(true)
  }

  const canContinue = {
    1: serviceId !== null,
    2: dentistId !== null,
    3: time !== null,
    4: time !== null,
  }[step]

  const confirm = async () => {
    if (!user?.patientId || !serviceId || !dentistId || !time || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      await appointmentsService.create({ patientId: user.patientId, dentistId, serviceId, date, time })
      navigate(ROUTES.PATIENT_APPOINTMENTS, { state: { created: true } })
    } catch (failure) {
      setError(failure.isConflict ? 'Ese horario acaba de ocuparse. Elija otro espacio.' : failure.message)
      if (failure.isConflict) {
        setTime(null)
        setSlots([])
        setIsLoadingSlots(true)
        setAvailabilityVersion((current) => current + 1)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    steps: BOOKING_STEPS,
    services,
    dentists,
    slots,
    service,
    dentist,
    date,
    today: todayInClinic(),
    time,
    endTime,
    canContinue,
    isLoadingServices,
    isLoadingDentists,
    isLoadingSlots,
    isSubmitting,
    error,
    selectService,
    selectDentist,
    selectDate,
    selectTime: setTime,
    next: () => setStep((current) => Math.min(current + 1, BOOKING_STEPS.length)),
    back: () => setStep((current) => Math.max(current - 1, 1)),
    goTo: setStep,
    confirm,
  }
}
