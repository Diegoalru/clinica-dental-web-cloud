import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { ENTITY_STATUS } from '@/constants/appointmentStatus'
import { useServiceForm } from '../hooks/useServiceForm'

/** Modal para crear o editar un servicio del catálogo. */
function ServiceFormModal({ open, onClose, onSaved, initialValues }) {
  const { field, errors, isSubmitting, formError, onSubmit, reset } = useServiceForm({ initialValues, onSaved })
  const editing = Boolean(initialValues?.id)

  const close = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={editing ? 'Editar servicio' : 'Nuevo servicio'}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" form="service-form" loading={isSubmitting}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="service-form" onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && <Alert tone="error">{formError}</Alert>}
        <FormField label="Nombre *" error={errors.name?.message} {...field('name')} />
        <Textarea label="Descripción" rows={2} error={errors.description?.message} {...field('description')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Duración (min) *" type="number" min="5" step="5" error={errors.durationMinutes?.message} {...field('durationMinutes')} />
          <FormField label="Precio (₡) *" type="number" min="0" step="500" error={errors.price?.message} {...field('price')} />
        </div>
        <Select label="Estado" error={errors.status?.message} {...field('status')}>
          <option value={ENTITY_STATUS.ACTIVE}>Activo (visible al agendar)</option>
          <option value={ENTITY_STATUS.INACTIVE}>Inactivo</option>
        </Select>
        <Alert tone="info">Cambiar el precio no altera citas ya agendadas: cada cita conserva su precio de referencia.</Alert>
      </form>
    </Modal>
  )
}

export default ServiceFormModal
