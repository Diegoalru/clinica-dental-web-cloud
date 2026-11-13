import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import { ROLE_LABELS, ROLES } from '@/constants/roles'
import { useUserForm } from '../hooks/useUserForm'

/** Modal para crear o editar un usuario del sistema. */
function UserFormModal({ open, onClose, onSaved, initialValues }) {
  const { field, errors, isSubmitting, formError, onSubmit, watchRole, reset } = useUserForm({ initialValues, onSaved })
  const editing = Boolean(initialValues?.id)

  const close = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={editing ? 'Editar usuario' : 'Nuevo usuario'}
      description="Un rol por usuario."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" form="user-form" loading={isSubmitting}>
            {editing ? 'Guardar' : 'Crear usuario'}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && <Alert tone="error">{formError}</Alert>}
        <FormField label="Nombre completo *" autoComplete="off" error={errors.fullName?.message} {...field('fullName')} />
        <FormField label="Correo electrónico *" type="email" autoComplete="off" error={errors.email?.message} {...field('email')} />
        <FormField label="Teléfono" type="tel" error={errors.phone?.message} {...field('phone')} />
        <Select
          label="Rol *"
          placeholder="Seleccione un rol"
          error={errors.role?.message}
          options={Object.values(ROLES).map((role) => ({ value: role, label: ROLE_LABELS[role] }))}
          {...field('role')}
        />
        {watchRole === ROLES.DENTIST && (
          <Alert tone="info">
            Si el rol es Odontólogo, al guardar se abre su perfil profesional (especialidad, licencia, horario).
          </Alert>
        )}
        {!editing && (
          <Checkbox
            label="Enviar invitación para crear contraseña"
            description="El usuario recibe un correo con un enlace para definir su contraseña."
            {...field('sendInvitation')}
          />
        )}
      </form>
    </Modal>
  )
}

export default UserFormModal
