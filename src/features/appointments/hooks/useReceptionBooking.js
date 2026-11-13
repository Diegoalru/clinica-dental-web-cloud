import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ENTITY_STATUS } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { addMinutes } from '@/utils/dateLabels'
import { dentistsForService } from '@/features/dentists/mocks/dentists'
import { findPatient, searchPatients } from '@/features/patients/mocks/patients'
import { services } from '@/features/services/mocks/services'
import { MOCK_TODAY, alternativeSlots, getAvailability } from '../mocks/appointments'

/**
 * Estado de "Nueva cita" (recepción): paciente, servicio/odontólogo/fecha, horario y opciones de correo.
 * Acepta `location.state = { patientId, dentistId }` para abrirse ya precargado (p. ej. cita de seguimiento).
 *
 * TODO(api): patientsService.list({ search }), appointmentsService.availability(), appointmentsService.create().
 * Si el API responde 409 (el espacio se ocupó mientras se llenaba el formulario), mostrar `conflict` con alternativas.
 */
export function useReceptionBooking() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [patientQuery, setPatientQuery] = useState('')
  const [patientId, setPatientId] = useState(state?.patientId ?? null)
  const [serviceId, setServiceId] = useState('')
  const [dentistId, setDentistId] = useState(state?.dentistId ? String(state.dentistId) : '')
  const [date, setDate] = useState(MOCK_TODAY)
  const [time, setTime] = useState(null)
  const [notes, setNotes] = useState('')
  const [sendConfirmation, setSendConfirmation] = useState(true)
  const [scheduleReminder, setScheduleReminder] = useState(true)
  const [conflict, setConflict] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const patient = patientId ? findPatient(patientId) : null
  const patientResults = useMemo(() => (patientQuery.trim() ? searchPatients(patientQuery).slice(0, 5) : []), [patientQuery])
  const activeServices = useMemo(() => services.filter((service) => service.status === ENTITY_STATUS.ACTIVE), [])
  const service = activeServices.find((item) => item.id === Number(serviceId)) ?? null
  const dentists = useMemo(() => (serviceId ? dentistsForService(serviceId) : []), [serviceId])
  const dentist = dentists.find((item) => item.id === Number(dentistId)) ?? null
  const slots = useMemo(() => (dentist && date ? getAvailability(dentist.id, date) : []), [dentist, date])
  const endTime = service && time ? addMinutes(time, service.durationMinutes) : null

  const selectService = (value) => {
    setServiceId(value)
    setDentistId('')
    setTime(null)
  }

  const selectDentist = (value) => {
    setDentistId(value)
    setTime(null)
  }

  const selectDate = (value) => {
    setDate(value)
    setTime(null)
  }

  const applyAlternative = (slot) => {
    setDentistId(String(slot.dentistId))
    setDate(slot.date)
    setTime(slot.time)
    setConflict(null)
  }

  const canSubmit = Boolean(patient && service && dentist && time)

  const submit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      // TODO(api): await appointmentsService.create({ patientId, dentistId, serviceId, date, time, notes })
      // Ante ApiError.isConflict → setConflict({ slots: error.data.alternatives }) y no navegar.
      navigate(ROUTES.RECEPTION_AGENDA)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    patient,
    patientQuery,
    setPatientQuery,
    patientResults,
    selectPatient: (id) => {
      setPatientId(id)
      setPatientQuery('')
    },
    clearPatient: () => setPatientId(null),
    services: activeServices,
    service,
    serviceId,
    selectService,
    dentists,
    dentist,
    dentistId,
    selectDentist,
    date,
    selectDate,
    slots,
    time,
    selectTime: setTime,
    endTime,
    notes,
    setNotes,
    sendConfirmation,
    setSendConfirmation,
    scheduleReminder,
    setScheduleReminder,
    conflict,
    // Permite simular desde la UI el estado de conflicto del wireframe
    simulateConflict: () => setConflict({ slots: alternativeSlots }),
    dismissConflict: () => setConflict(null),
    applyAlternative,
    canSubmit,
    isSubmitting,
    submit,
  }
}
