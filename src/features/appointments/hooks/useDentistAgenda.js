import { useEffect, useMemo, useState } from 'react'
import { dentistsService } from '@/features/dentists/services/dentistsService'
import { addDays, startOfWeek } from '@/utils/dateLabels'
import { appointmentsService } from '../services/appointmentsService'
import { toDisplayAppointment } from '../utils/appointmentMapper'

/**
 * Agenda del odontólogo con sesión: su ficha, horario y bloqueos (GET /dentists/me) y las citas de la semana
 * del día elegido (GET /appointments; el API ya devuelve solo las suyas). Las fechas sin zona que se envían
 * son hora de Costa Rica.
 */
export function useDentistAgenda(date) {
  const [dentist, setDentist] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loadedWeek, setLoadedWeek] = useState(null)
  const [error, setError] = useState(null)
  const monday = startOfWeek(date)

  useEffect(() => {
    const controller = new AbortController()
    dentistsService.me({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setDentist(data)
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const params = { from: `${monday}T00:00:00`, to: `${addDays(monday, 7)}T00:00:00` }
    appointmentsService.listAll(params, { signal: controller.signal })
      .then((items) => {
        if (controller.signal.aborted) return
        setAppointments(items.map(toDisplayAppointment))
        setLoadedWeek(monday)
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
    return () => controller.abort()
  }, [monday])

  const profile = useMemo(
    () => (dentist ? { ...dentist, displayName: dentist.fullName } : null),
    [dentist],
  )

  return {
    dentist: profile,
    appointments,
    isLoading: !error && (!dentist || loadedWeek !== monday),
    error,
  }
}
