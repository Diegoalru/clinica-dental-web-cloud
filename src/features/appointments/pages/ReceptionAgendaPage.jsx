import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import Legend from '@/components/common/Legend'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import LoadingState from '@/components/ui/LoadingState'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import Stat from '@/components/ui/Stat'
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { dentistsService } from '@/features/dentists/services/dentistsService'
import { todayInClinic } from '@/utils/clinicTime'
import { addDays, formatIsoDateLong, formatTime24 } from '@/utils/dateLabels'
import AgendaGrid from '../components/AgendaGrid'
import { appointmentsService } from '../services/appointmentsService'
import { toDisplayAppointment } from '../utils/appointmentMapper'

/** Agenda real del día para recepción y administración. */
function ReceptionAgendaPage() {
  const { state } = useLocation()
  const [date, setDate] = useState(state?.date ?? todayInClinic)
  const [dentistFilter, setDentistFilter] = useState('')
  const [query, setQuery] = useState('')
  const [dentists, setDentists] = useState([])
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDentists, setIsLoadingDentists] = useState(true)
  const [error, setError] = useState(null)
  const [showCreated, setShowCreated] = useState(Boolean(state?.createdId))
  const [reloadVersion, setReloadVersion] = useState(0)

  useEffect(() => {
    const refresh = () => { setIsLoading(true); setReloadVersion((v) => v + 1) }
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    dentistsService.list(undefined, { signal: controller.signal })
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
  }, [reloadVersion])

  useEffect(() => {
    const controller = new AbortController()
    appointmentsService.listAll({ from: `${date}T00:00:00`, to: `${addDays(date, 1)}T00:00:00` }, { signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setAppointments(items.map(toDisplayAppointment))
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })
    return () => controller.abort()
  }, [date, reloadVersion])

  const changeDate = (value) => {
    setError(null)
    setIsLoading(true)
    setDate(value)
  }
  const retry = () => {
    setError(null)
    setIsLoading(true)
    setIsLoadingDentists(true)
    setReloadVersion((value) => value + 1)
  }

  const visibleDentists = dentistFilter ? dentists.filter((item) => item.id === Number(dentistFilter)) : dentists
  const visibleAppointments = useMemo(() => {
    const text = query.trim().toLowerCase()
    return appointments.filter((item) =>
      (!dentistFilter || item.dentist.id === Number(dentistFilter)) &&
      (!text || item.patient.fullName.toLowerCase().includes(text) || String(item.id).includes(text)))
  }, [appointments, dentistFilter, query])
  const count = (status) => visibleAppointments.filter((item) => item.status === status).length
  const pending = visibleAppointments.filter((item) => item.status === APPOINTMENT_STATUS.PENDING)

  return (
    <PageContainer>
      {showCreated && (
        <Alert tone="success" title="Cita agendada" onClose={() => setShowCreated(false)}>
          La cita #{state.createdId} quedó registrada en estado Pendiente.
        </Alert>
      )}
      <PageHeader
        eyebrow="Recepción"
        title="Agenda del día"
        actions={
          <>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar paciente o cita" className="w-full sm:w-64" />
            <Button as={Link} to={ROUTES.RECEPTION_NEW_APPOINTMENT} icon="plus">Nueva cita</Button>
          </>
        }
      />
      {error && (
        <Alert tone="error" title="No se pudo cargar la agenda">
          {error}{' '}
          <Button variant="link" onClick={retry}>Reintentar</Button>
        </Alert>
      )}

      <Card padding={false}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="icon-sm" onClick={() => changeDate(addDays(date, -1))} aria-label="Día anterior">
              <Icon name="chevron-left" size={16} />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => changeDate(todayInClinic())}>Hoy</Button>
            <Button variant="secondary" size="icon-sm" onClick={() => changeDate(addDays(date, 1))} aria-label="Día siguiente">
              <Icon name="chevron-right" size={16} />
            </Button>
          </div>
          <p className="text-sm font-semibold text-slate-900">{formatIsoDateLong(date)}</p>
          <div className="ml-auto">
            <Select value={dentistFilter} onChange={(event) => setDentistFilter(event.target.value)} aria-label="Filtrar por odontólogo" className="w-52">
              <option value="">Todos los odontólogos</option>
              {dentists.map((dentist) => <option key={dentist.id} value={dentist.id}>{dentist.displayName}</option>)}
            </Select>
          </div>
        </div>

        {isLoading || isLoadingDentists ? <LoadingState label="Cargando agenda…" /> : !error && (
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              {visibleDentists.length > 0 ? (
                <AgendaGrid dentists={visibleDentists} appointments={visibleAppointments} date={date} />
              ) : (
                <p className="px-6 py-16 text-center text-sm text-slate-500">No hay odontólogos activos.</p>
              )}
              <div className="border-t border-slate-100 px-4 py-3">
                <Legend items={Object.values(APPOINTMENT_STATUS).map((status) => ({ label: APPOINTMENT_STATUS_LABELS[status], tone: APPOINTMENT_STATUS_TONES[status] }))} />
              </div>
            </div>

            <aside className="space-y-4 border-t border-slate-100 p-4 lg:border-t-0 lg:border-l">
              <section aria-label="Resumen del día">
                <h2 className="text-sm font-semibold text-slate-900">Resumen del día</h2>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Stat compact label="Total" value={visibleAppointments.length} />
                  <Stat compact label="Pendientes" value={count(APPOINTMENT_STATUS.PENDING)} tone="amber" />
                  <Stat compact label="Confirmadas" value={count(APPOINTMENT_STATUS.CONFIRMED)} tone="sky" />
                  <Stat compact label="Completadas" value={count(APPOINTMENT_STATUS.COMPLETED)} tone="emerald" />
                </div>
              </section>
              <section aria-label="Pendientes de confirmar">
                <h2 className="text-sm font-semibold text-slate-900">Pendientes de confirmar</h2>
                <ul className="mt-2 space-y-2">
                  {pending.length === 0 && <li className="text-sm text-slate-500">Nada pendiente.</li>}
                  {pending.map((item) => (
                    <li key={item.id} className="rounded-lg border border-slate-200 px-3 py-2">
                      <p className="truncate text-sm font-medium text-slate-900">{item.patient.fullName} · #{item.id}</p>
                      <p className="text-xs text-slate-500">{formatTime24(item.startsAt)} · {item.dentist.displayName}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        )}
      </Card>
    </PageContainer>
  )
}

export default ReceptionAgendaPage
