import { useCallback, useEffect, useState } from 'react'
import { appointmentsService } from '../services/appointmentsService'
import { toAppointmentDetail, toDisplayAppointment } from '../utils/appointmentMapper'

/**
 * Detalle de una cita (GET /appointments/:id), el historial del paciente y los cambios de estado
 * (PATCH /appointments/:id/status). La página solo pinta lo que devuelve.
 */
export function useAppointmentDetail(id) {
  const [appointment, setAppointment] = useState(null)
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    appointmentsService.get(id, { signal })
      .then(async (data) => {
        if (signal.aborted) return
        setAppointment(toAppointmentDetail(data))
        const items = await appointmentsService.listAll({ patientId: data.patientId }, { signal })
        if (!signal.aborted) {
          setHistory(items.filter((item) => item.id !== data.id).map(toDisplayAppointment))
        }
      })
      .catch((failure) => {
        if (signal.aborted) return
        if (failure.status === 404) setNotFound(true)
        else setError(failure.message)
      })
      .finally(() => {
        if (!signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [id])

  // Devuelve true si el cambio se guardó; si no, deja el mensaje del API en `error`
  const changeStatus = useCallback(async (request) => {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await request()
      setAppointment(toAppointmentDetail(updated))
      return true
    } catch (failure) {
      setError(failure.message)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [])

  return {
    appointment,
    history,
    isLoading,
    notFound,
    error,
    isSaving,
    clearError: () => setError(null),
    setExternalError: setError,
    confirm: () => changeStatus(() => appointmentsService.confirm(id)),
    cancel: (remarks) => changeStatus(() => appointmentsService.cancel(id, remarks)),
    markNoShow: () => changeStatus(() => appointmentsService.markNoShow(id)),
    reschedule: (form) => changeStatus(() => appointmentsService.reschedule(id, form)),
    resendConfirmation: () => changeStatus(() => appointmentsService.resendConfirmation(id)),
  }
}
