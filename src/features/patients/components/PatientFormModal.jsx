import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import { usePatientForm } from '../hooks/usePatientForm'

/**
 * Modal para registrar (o editar) un paciente. `duplicateOf`: paciente existente con la misma identificación,
 * para mostrar el aviso del wireframe con enlace al registro.
 */
function PatientFormModal({ open, onClose, onSaved, initialValues, duplicateOf }) {
  const { field, errors, isSubmitting, formError, onSubmit, reset } = usePatientForm({ initialValues, onSaved })
  const editing = Boolean(initialValues?.id)

  const close = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={editing ? 'Editar paciente' : 'Registrar paciente'}
      description="Los campos marcados con * son obligatorios."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" form="patient-form" loading={isSubmitting}>
            Guardar paciente
          </Button>
        </>
      }
    >
      <form id="patient-form" onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && <Alert tone="error">{formError}</Alert>}
        {duplicateOf && (
          <Alert tone="warning" title="Ya existe un paciente con esta identificación.">
            <Button variant="link">Ver registro de {duplicateOf.fullName}</Button>
          </Alert>
        )}

        <FormField label="Nombre completo *" autoComplete="off" error={errors.fullName?.message} {...field('fullName')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Identificación *"
            hint="Cédula, DIMEX o pasaporte."
            error={errors.identification?.message}
            {...field('identification')}
          />
          <FormField label="Fecha de nacimiento" type="date" error={errors.birthDate?.message} {...field('birthDate')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Teléfono" type="tel" error={errors.phone?.message} {...field('phone')} />
          <FormField label="Correo electrónico" type="email" error={errors.email?.message} {...field('email')} />
        </div>
        <FormField
          label="Contacto de emergencia"
          hint="Nombre y teléfono."
          error={errors.emergencyContact?.message}
          {...field('emergencyContact')}
        />

        <div className="space-y-3 rounded-lg bg-slate-50 p-4">
          <Checkbox
            label="Consentimiento de tratamiento de datos *"
            description="Se guarda la fecha y hora de aceptación."
            error={errors.acceptsDataConsent?.message}
            {...field('acceptsDataConsent')}
          />
          <Checkbox
            label="Crear acceso al portal del paciente"
            description="Vincula el registro con una cuenta de usuario y envía la invitación por correo."
            {...field('createPortalAccess')}
          />
        </div>
      </form>
    </Modal>
  )
}

export default PatientFormModal
