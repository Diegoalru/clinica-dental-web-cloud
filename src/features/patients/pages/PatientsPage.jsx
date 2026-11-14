import { useEffect, useState } from 'react'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import LoadingState from '@/components/ui/LoadingState'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import StatusBadge from '@/components/ui/StatusBadge'
import Table, { Td, Th } from '@/components/ui/Table'
import { maskEmail } from '@/utils/privacy'
import { patientsService } from '../services/patientsService'

/** Consulta real de pacientes activos para recepción. */
function PatientsPage() {
  const [query, setQuery] = useState('')
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const refresh = () => setVersion((v) => v + 1)
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      patientsService.list({ search: query || undefined }, { signal: controller.signal })
        .then((items) => {
          if (!controller.signal.aborted) { setPatients(items); setError(null) }
        })
        .catch((failure) => {
          if (!controller.signal.aborted) setError(failure.message)
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, query ? 250 : 0)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query, version])

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Recepción"
        title="Pacientes"
        description="Pacientes activos registrados en la clínica. Busque por nombre o identificación."
      />
      {error && (
        <Alert tone="error" title="No se pudieron cargar los pacientes">
          {error} <button type="button" className="underline" onClick={() => setVersion((v) => v + 1)}>Reintentar</button>
        </Alert>
      )}
      <Card padding={false}>
        <div className="border-b border-slate-100 px-4 py-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar paciente" className="w-full sm:w-72" />
        </div>
        {loading ? <LoadingState label="Buscando pacientes…" /> : !error && (
          patients.length === 0 ? (
            <EmptyState title="No se encontraron pacientes" description="Pruebe con otro nombre o identificación." />
          ) : (
            <Table>
              <thead>
                <tr><Th>Nombre</Th><Th>Identificación</Th><Th>Teléfono</Th><Th>Portal</Th></tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <Td>
                      <p className="font-medium text-slate-900">{patient.fullName}</p>
                      <p className="text-xs text-slate-500">{maskEmail(patient.email)}</p>
                    </Td>
                    <Td className="tabular-nums">{patient.identification}</Td>
                    <Td className="tabular-nums">{patient.phone ?? '—'}</Td>
                    <Td>{patient.userId ? <StatusBadge tone="sky">Con cuenta</StatusBadge> :
                      <StatusBadge tone="slate" dot={false}>Sin cuenta</StatusBadge>}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        )}
      </Card>
      <p className="mt-3 text-xs text-slate-500">Se muestran hasta 20 pacientes. Use la búsqueda para encontrar otros registros.</p>
    </PageContainer>
  )
}

export default PatientsPage
