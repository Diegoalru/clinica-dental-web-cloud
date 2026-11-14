import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'
import { todayInClinic } from '@/utils/clinicTime'
import AppointmentCard from './AppointmentCard'
import { appointmentsService } from '../services/appointmentsService'
import { toDisplayAppointment } from '../utils/appointmentMapper'

/** Resumen real para el inicio del paciente. El API limita el resultado a su propia cuenta. */
function PatientNextAppointment() {
  const [next, setNext] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let controller = new AbortController()
    const load = () => {
      controller.abort()
      controller = new AbortController()
      appointmentsService.listAll({ from: `${todayInClinic()}T00:00:00` }, { signal: controller.signal })
        .then((items) => {
          const upcoming = items.map(toDisplayAppointment)
            .filter((item) => [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED].includes(item.status))
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
          setNext(upcoming[0] ?? null)
          setError(null)
        })
        .catch((failure) => {
          if (!controller.signal.aborted) setError(failure.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }
    load()
    const refresh = () => { setLoading(true); load() }
    window.addEventListener('focus', refresh)
    return () => { controller.abort(); window.removeEventListener('focus', refresh) }
  }, [])

  return (
    <Card title="Próxima cita" actions={<Button as={Link} to={ROUTES.PATIENT_APPOINTMENTS} variant="secondary" size="sm">Ver mis citas</Button>}>
      {loading ? <p className="text-sm text-slate-500">Cargando próxima cita…</p> :
        error ? <p className="text-sm text-rose-700">{error}</p> :
        next ? <AppointmentCard appointment={next} /> :
          <p className="text-sm text-slate-600">No hay citas próximas registradas.</p>}
    </Card>
  )
}

export default PatientNextAppointment
