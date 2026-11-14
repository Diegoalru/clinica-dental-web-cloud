import { useEffect, useState } from 'react'
import { servicesService } from '../services/servicesService'

/** Catálogo de servicios activos desde GET /services (el API ya filtra los inactivos). */
export function useServicesCatalog() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [])

  return { services, isLoading, error }
}
