import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { dentistsService } from '@/features/dentists/services/dentistsService'
import { patientsService } from '@/features/patients/services/patientsService'
import { servicesService } from '@/features/services/services/servicesService'
import { todayInClinic } from '@/utils/clinicTime'
import { addMinutes } from '@/utils/dateLabels'
import { appointmentsService } from '../services/appointmentsService'

/** Reserva para un paciente existente, disponible para recepción y administración. */
export function useReceptionBooking() {
  const navigate = useNavigate()
  const [patientQuery, setPatientQuery] = useState('')
  const [patientResults, setPatientResults] = useState([])
  const [patient, setPatient] = useState(null)
  const [services, setServices] = useState([])
  const [dentists, setDentists] = useState([])
  const [slots, setSlots] = useState([])
  const [serviceId, setServiceId] = useState('')
  const [dentistId, setDentistId] = useState('')
  const [date, setDate] = useState(todayInClinic)
  const [time, setTime] = useState(null)
  const [availabilityVersion, setAvailabilityVersion] = useState(0)
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [isLoadingDentists, setIsLoadingDentists] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      setIsLoadingPatients(true)
      patientsService.list({ search: patientQuery || undefined }, { signal: controller.signal })
        .then((items) => {
          if (controller.signal.aborted) return
          setPatientResults(items)
        })
        .catch((failure) => {
          if (!controller.signal.aborted) setError(failure.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoadingPatients(false)
        })
    }, patientQuery ? 250 : 0)
    return () => { clearTimeout(timer); controller.abort() }
  }, [patientQuery])

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
    dentistsService.list({ serviceId: Number(serviceId) }, { signal: controller.signal })
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
    if (!serviceId || !dentistId || !date) return
    const controller = new AbortController()
    appointmentsService.availability({ dentistId: Number(dentistId), serviceId: Number(serviceId), date }, { signal: controller.signal })
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
  }, [serviceId, dentistId, date, availabilityVersion])

  const service = useMemo(() => services.find((item) => item.id === Number(serviceId)) ?? null, [services, serviceId])
  const dentist = useMemo(() => dentists.find((item) => item.id === Number(dentistId)) ?? null, [dentists, dentistId])
  const endTime = service && time ? addMinutes(time, service.durationMinutes) : null
  const canSubmit = Boolean(patient && service && dentist && time && !isSubmitting)

  const updatePatientQuery = (value) => {
    setPatientQuery(value)
    setPatientResults([])
    setIsLoadingPatients(true)
  }

  const selectService = (value) => {
    if (value === serviceId) return
    setServiceId(value)
    setDentistId('')
    setDentists([])
    setSlots([])
    setTime(null)
    setError(null)
    setIsLoadingDentists(Boolean(value))
  }

  const selectDentist = (value) => {
    if (value === dentistId) return
    setDentistId(value)
    setSlots([])
    setTime(null)
    setError(null)
    setIsLoadingSlots(Boolean(value))
  }

  const selectDate = (value) => {
    if (value === date) return
    setDate(value)
    setSlots([])
    setTime(null)
    setError(null)
    setIsLoadingSlots(Boolean(dentistId && value))
  }

  const submit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    setError(null)
    try {
      const created = await appointmentsService.create({
        patientId: patient.id,
        serviceId: service.id,
        dentistId: dentist.id,
        date,
        time,
      })
      navigate(ROUTES.RECEPTION_AGENDA, { state: { createdId: created.id, date } })
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
    patient,
    patientQuery,
    setPatientQuery: updatePatientQuery,
    patientResults,
    selectPatient: (id) => { setPatient(patientResults.find((item) => item.id === id) ?? null); setPatientQuery('') },
    clearPatient: () => setPatient(null),
    services,
    service,
    serviceId,
    selectService,
    dentists,
    dentist,
    dentistId,
    selectDentist,
    date,
    today: todayInClinic(),
    selectDate,
    slots,
    time,
    selectTime: setTime,
    endTime,
    canSubmit,
    isLoadingPatients,
    isLoadingServices,
    isLoadingDentists,
    isLoadingSlots,
    isSubmitting,
    error,
    submit,
  }
}
