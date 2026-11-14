import { useEffect, useState } from 'react'
import { patientsService } from '../services/patientsService'

/**
 * Ficha del paciente con sesión (GET /patients/me). Para los demás roles no consulta nada:
 * su perfil solo muestra los datos de la cuenta.
 */
export function usePatientProfile(isPatient) {
  const [patient, setPatient] = useState(null)
  const [isLoading, setIsLoading] = useState(isPatient)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isPatient) return
    const controller = new AbortController()
    patientsService.me({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setPatient(data)
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [isPatient])

  return { patient, isLoading, error }
}
