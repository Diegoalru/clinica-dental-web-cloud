import { useMemo, useState } from 'react'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'
import Pagination from '@/components/ui/Pagination'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import Table, { Td, Th } from '@/components/ui/Table'
import { ENTITY_STATUS, ENTITY_STATUS_LABELS } from '@/constants/appointmentStatus'
import { maskEmail } from '@/utils/privacy'
import PatientFormModal from '../components/PatientFormModal'
import { searchPatients } from '../mocks/patients'

const PAGE_SIZE = 6

/** Pacientes (recepción): búsqueda, filtro por estado, tabla paginada y modal de registro. */
function PatientsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [savedMessage, setSavedMessage] = useState(null)

  // TODO(api): patientsService.list({ search: query, status, page, pageSize: PAGE_SIZE })
  const results = useMemo(
    () => searchPatients(query).filter((patient) => !status || patient.status === status),
    [query, status],
  )
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (patient) => {
    setEditing({
      ...patient,
      birthDate: patient.birthDate ?? '',
      phone: patient.phone ?? '',
      email: patient.email ?? '',
      emergencyContact: patient.emergencyContact ?? '',
      acceptsDataConsent: Boolean(patient.dataConsentAt),
      createPortalAccess: Boolean(patient.userId),
    })
    setModalOpen(true)
  }

  const onSaved = (values) => {
    setModalOpen(false)
    setSavedMessage(`Datos de ${values.fullName.trim()} guardados.`)
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Recepción"
        title="Pacientes"
        description="Registro y búsqueda de pacientes de la clínica."
        actions={
          <Button icon="plus" onClick={openNew}>
            Registrar paciente
          </Button>
        }
      />

      {savedMessage && (
        <Alert tone="success" onClose={() => setSavedMessage(null)}>
          {savedMessage}
        </Alert>
      )}

      <Card padding={false}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value)
              setPage(1)
            }}
            placeholder="Buscar paciente"
            className="w-full sm:w-72"
          />
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            aria-label="Filtrar por estado"
            className="w-44"
          >
            <option value="">Todos los estados</option>
            {Object.values(ENTITY_STATUS).map((value) => (
              <option key={value} value={value}>
                {ENTITY_STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>

        {pageItems.length === 0 ? (
          <EmptyState
            title="No se encontraron pacientes"
            description="Pruebe con otro nombre o identificación, o registre un paciente nuevo."
            action={
              <Button icon="plus" onClick={openNew}>
                Registrar paciente
              </Button>
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>Identificación</Th>
                <Th>Teléfono</Th>
                <Th>Portal</Th>
                <Th>Estado</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50">
                  <Td>
                    <p className="font-medium text-slate-900">{patient.fullName}</p>
                    <p className="text-xs text-slate-500">{maskEmail(patient.email)}</p>
                  </Td>
                  <Td className="tabular-nums">{patient.identification}</Td>
                  <Td className="tabular-nums">{patient.phone ?? '—'}</Td>
                  <Td>
                    {patient.userId ? (
                      <StatusBadge tone="sky">Con cuenta</StatusBadge>
                    ) : (
                      <StatusBadge tone="slate" dot={false}>
                        Sin cuenta
                      </StatusBadge>
                    )}
                  </Td>
                  <Td>
                    <StatusBadge status={patient.status} />
                  </Td>
                  <Td align="right">
                    <Button variant="ghost" size="sm" icon="edit" onClick={() => openEdit(patient)}>
                      Editar
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="border-t border-slate-100 px-4 py-3">
          <Pagination page={page} pageSize={PAGE_SIZE} total={results.length} onChange={setPage} />
        </div>
      </Card>

      <PatientFormModal
        key={editing?.id ?? 'new'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={onSaved}
        initialValues={editing ?? undefined}
      />
    </PageContainer>
  )
}

export default PatientsPage
