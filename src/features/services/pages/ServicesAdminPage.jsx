import { useMemo, useState } from 'react'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import StatusBadge from '@/components/ui/StatusBadge'
import Table, { Td, Th } from '@/components/ui/Table'
import { formatCurrency, formatDuration } from '@/utils/formatCurrency'
import { dentists } from '@/features/dentists/mocks/dentists'
import ServiceFormModal from '../components/ServiceFormModal'
import { services, specialties } from '../mocks/services'

/** Servicios y especialidades (administración). */
function ServicesAdminPage() {
  const [query, setQuery] = useState('')
  const [serviceModal, setServiceModal] = useState({ open: false, service: null })
  const [specialtyOpen, setSpecialtyOpen] = useState(false)
  const [message, setMessage] = useState(null)

  // TODO(api): servicesService.list() y servicesService.listSpecialties()
  const list = useMemo(() => {
    const text = query.trim().toLowerCase()
    return services.filter((service) => !text || service.name.toLowerCase().includes(text))
  }, [query])
  const dentistsBySpecialty = (specialtyId) => dentists.filter((dentist) => dentist.specialtyId === specialtyId).length

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Administración"
        title="Servicios y especialidades"
        actions={
          <Button icon="plus" onClick={() => setServiceModal({ open: true, service: null })}>
            Nuevo servicio
          </Button>
        }
      />

      {message && (
        <Alert tone="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <Card title="Catálogo de servicios" padding={false} actions={<SearchInput value={query} onChange={setQuery} placeholder="Buscar servicio" className="w-56" />}>
          <Table>
            <thead>
              <tr>
                <Th>Servicio</Th>
                <Th>Duración</Th>
                <Th align="right">Precio</Th>
                <Th align="center">Odontólogos</Th>
                <Th>Estado</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50">
                  <Td>
                    <p className="font-medium text-slate-900">{service.name}</p>
                    <p className="text-xs text-slate-500">{service.description}</p>
                  </Td>
                  <Td className="tabular-nums">{formatDuration(service.durationMinutes)}</Td>
                  <Td align="right" className="tabular-nums">{formatCurrency(service.price)}</Td>
                  <Td align="center" className="tabular-nums">{service.dentistCount}</Td>
                  <Td>
                    <StatusBadge status={service.status} />
                  </Td>
                  <Td align="right">
                    <Button variant="ghost" size="sm" icon="edit" onClick={() => setServiceModal({ open: true, service })}>
                      Editar
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card
          title="Especialidades"
          className="self-start"
          actions={
            <Button variant="secondary" size="sm" icon="plus" onClick={() => setSpecialtyOpen(true)}>
              Agregar
            </Button>
          }
        >
          <ul className="space-y-2">
            {specialties.map((specialty) => (
              <li key={specialty.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-900">{specialty.name}</p>
                  <p className="text-xs text-slate-500">{specialty.description}</p>
                </div>
                <StatusBadge tone="slate" dot={false}>
                  {dentistsBySpecialty(specialty.id)} odont.
                </StatusBadge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <ServiceFormModal
        key={serviceModal.service?.id ?? 'new'}
        open={serviceModal.open}
        onClose={() => setServiceModal({ open: false, service: null })}
        onSaved={(values) => {
          setServiceModal({ open: false, service: null })
          setMessage(`Servicio «${values.name.trim()}» guardado.`)
        }}
        initialValues={serviceModal.service ?? undefined}
      />

      <Modal
        open={specialtyOpen}
        onClose={() => setSpecialtyOpen(false)}
        title="Nueva especialidad"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSpecialtyOpen(false)}>
              Cancelar
            </Button>
            {/* TODO(api): servicesService.createSpecialty(values) */}
            <Button
              onClick={() => {
                setSpecialtyOpen(false)
                setMessage('Especialidad guardada.')
              }}
            >
              Guardar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Nombre *" />
          <FormField label="Descripción" />
        </div>
      </Modal>
    </PageContainer>
  )
}

export default ServicesAdminPage
