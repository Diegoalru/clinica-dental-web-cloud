import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import Tabs from '@/components/ui/Tabs'
import { ENTITY_STATUS } from '@/constants/appointmentStatus'
import { maskEmail } from '@/utils/privacy'
import { services, specialties } from '@/features/services/mocks/services'
import { useDentistEditor } from '../hooks/useDentistEditor'
import BlocksTable from './BlocksTable'
import WeeklyScheduleTable from './WeeklyScheduleTable'

const TABS = [
  { value: 'profile', label: 'Perfil' },
  { value: 'services', label: 'Servicios y horario' },
  { value: 'blocks', label: 'Bloqueos' },
]

const EMPTY_BLOCK = { startDate: '', startTime: '08:00', endDate: '', endTime: '17:00', reason: '' }

/** Panel derecho de "Odontólogos": perfil, servicios/horario y bloqueos del odontólogo seleccionado. */
function DentistEditor({ dentist, onSaved }) {
  const editor = useDentistEditor(dentist)
  const [tab, setTab] = useState('profile')
  const [blockOpen, setBlockOpen] = useState(false)
  const [block, setBlock] = useState(EMPTY_BLOCK)

  const addBlock = () => {
    if (!block.startDate || !block.endDate) return
    editor.addBlock({
      startsAt: `${block.startDate}T${block.startTime}:00-06:00`,
      endsAt: `${block.endDate}T${block.endTime}:00-06:00`,
      reason: block.reason,
    })
    setBlock(EMPTY_BLOCK)
    setBlockOpen(false)
  }

  const save = async () => {
    const ok = await editor.save()
    if (ok) onSaved?.(`Cambios de ${dentist.displayName} guardados.`)
  }

  return (
    <Card
      padding={false}
      title={
        <span className="flex flex-wrap items-center gap-2">
          {dentist.displayName}
          <StatusBadge status={editor.draft.status} />
        </span>
      }
      description={`${maskEmail(dentist.email)} · ${dentist.phone}`}
      actions={
        <Button
          variant={editor.draft.status === ENTITY_STATUS.ACTIVE ? 'danger-outline' : 'secondary'}
          size="sm"
          onClick={editor.toggleStatus}
        >
          {editor.draft.status === ENTITY_STATUS.ACTIVE ? 'Desactivar' : 'Activar'}
        </Button>
      }
    >
      <div className="px-5">
        <Tabs items={TABS} value={tab} onChange={setTab} label="Secciones del odontólogo" />
      </div>

      <div className="p-5">
        {tab === 'profile' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Especialidad"
              value={editor.draft.specialtyId}
              onChange={(event) => editor.setProfile('specialtyId', Number(event.target.value))}
              options={specialties.map((item) => ({ value: item.id, label: item.name }))}
            />
            <FormField
              label="N.º de licencia"
              value={editor.draft.licenseNumber}
              onChange={(event) => editor.setProfile('licenseNumber', event.target.value)}
            />
            <FormField label="Nombre" value={dentist.fullName} disabled hint="El nombre y el contacto se editan en Usuarios." />
            <FormField label="Correo" value={dentist.email} disabled />
          </div>
        )}

        {tab === 'services' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Servicios habilitados</h3>
              <p className="text-xs text-slate-500">Solo estos servicios se pueden agendar con este odontólogo.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <Checkbox
                    key={service.id}
                    label={service.name}
                    description={service.status === ENTITY_STATUS.INACTIVE ? 'Servicio inactivo' : undefined}
                    checked={editor.draft.serviceIds.includes(service.id)}
                    onChange={() => editor.toggleService(service.id)}
                  />
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-900">Horario semanal</h3>
              <p className="text-xs text-slate-500">Varios tramos por día.</p>
              <div className="mt-3 -mx-5">
                <WeeklyScheduleTable
                  editable
                  schedules={editor.draft.schedules}
                  onAdd={editor.addSchedule}
                  onChange={editor.updateSchedule}
                  onRemove={editor.removeSchedule}
                />
              </div>
            </section>
          </div>
        )}

        {tab === 'blocks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Bloqueos próximos</h3>
              <Button variant="secondary" size="sm" icon="plus" onClick={() => setBlockOpen(true)}>
                Agregar bloqueo
              </Button>
            </div>
            <div className="-mx-5">
              <BlocksTable editable blocks={editor.draft.blocks} onRemove={editor.removeBlock} />
            </div>
            <Alert tone="info">
              Si un bloqueo choca con citas existentes, se avisa antes de guardar y se listan las citas a reprogramar.
            </Alert>
          </div>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
        {editor.dirty && <span className="mr-auto text-xs text-amber-700">Hay cambios sin guardar.</span>}
        <Button variant="secondary" onClick={editor.discard} disabled={!editor.dirty}>
          Descartar cambios
        </Button>
        <Button icon="check" onClick={save} disabled={!editor.dirty} loading={editor.isSaving}>
          Guardar
        </Button>
      </footer>

      <Modal
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        title="Agregar bloqueo"
        description="Vacaciones, reuniones o permisos. Quita espacios de la agenda."
        footer={
          <>
            <Button variant="secondary" onClick={() => setBlockOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={addBlock} disabled={!block.startDate || !block.endDate}>
              Agregar
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Desde (fecha)" type="date" value={block.startDate} onChange={(event) => setBlock({ ...block, startDate: event.target.value })} />
          <FormField label="Desde (hora)" type="time" value={block.startTime} onChange={(event) => setBlock({ ...block, startTime: event.target.value })} />
          <FormField label="Hasta (fecha)" type="date" value={block.endDate} onChange={(event) => setBlock({ ...block, endDate: event.target.value })} />
          <FormField label="Hasta (hora)" type="time" value={block.endTime} onChange={(event) => setBlock({ ...block, endTime: event.target.value })} />
          <FormField label="Motivo" className="sm:col-span-2" value={block.reason} onChange={(event) => setBlock({ ...block, reason: event.target.value })} />
        </div>
      </Modal>
    </Card>
  )
}

export default DentistEditor
