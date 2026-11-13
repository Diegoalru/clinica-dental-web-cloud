import { useMemo, useState } from 'react'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import { specialties } from '@/features/services/mocks/services'
import DentistEditor from '../components/DentistEditor'
import { dentists } from '../mocks/dentists'

/** Odontólogos (administración): lista a la izquierda y editor del seleccionado a la derecha. */
function DentistsAdminPage() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(dentists[0]?.id ?? null)
  const [newOpen, setNewOpen] = useState(false)
  const [message, setMessage] = useState(null)

  // TODO(api): dentistsService.list()
  const list = useMemo(() => {
    const text = query.trim().toLowerCase()
    return dentists.filter((dentist) => !text || dentist.fullName.toLowerCase().includes(text) || dentist.specialty.toLowerCase().includes(text))
  }, [query])
  const selected = dentists.find((dentist) => dentist.id === selectedId) ?? null

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Administración"
        title="Odontólogos"
        description="Perfil profesional, servicios habilitados, horario semanal y bloqueos."
        actions={
          <Button icon="plus" onClick={() => setNewOpen(true)}>
            Nuevo odontólogo
          </Button>
        }
      />

      {message && (
        <Alert tone="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card padding={false} className="self-start">
          <div className="border-b border-slate-100 p-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar odontólogo" />
          </div>
          <ul className="divide-y divide-slate-100">
            {list.map((dentist) => {
              const active = dentist.id === selectedId
              return (
                <li key={dentist.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedId(dentist.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      active ? 'bg-brand-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {dentist.fullName.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">{dentist.displayName}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {dentist.specialty.replace('Odontología general', 'General')} · Lic. {dentist.licenseNumber}
                      </span>
                    </span>
                    <StatusBadge status={dentist.status} size="xs" dot={false} />
                  </button>
                </li>
              )
            })}
            {list.length === 0 && <li className="px-4 py-6 text-center text-sm text-slate-500">Sin resultados.</li>}
          </ul>
        </Card>

        {selected ? (
          <DentistEditor key={selected.id} dentist={selected} onSaved={setMessage} />
        ) : (
          <Card>
            <p className="text-sm text-slate-500">Seleccione un odontólogo de la lista.</p>
          </Card>
        )}
      </div>

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Nuevo odontólogo"
        description="Cree primero el usuario con rol Odontólogo; luego complete aquí su perfil profesional."
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewOpen(false)}>
              Cancelar
            </Button>
            {/* TODO(api): usersService.create({ role: 'DENTIST' }) y luego dentistsService.update(perfil) */}
            <Button
              onClick={() => {
                setNewOpen(false)
                setMessage('Odontólogo creado. Complete su horario y servicios habilitados.')
              }}
            >
              Crear odontólogo
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nombre completo *" className="sm:col-span-2" />
          <FormField label="Correo electrónico *" type="email" className="sm:col-span-2" />
          <Select label="Especialidad *" placeholder="Seleccione" options={specialties.map((item) => ({ value: item.id, label: item.name }))} />
          <FormField label="N.º de licencia *" />
        </div>
      </Modal>
    </PageContainer>
  )
}

export default DentistsAdminPage
