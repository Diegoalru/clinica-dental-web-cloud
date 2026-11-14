import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { ROLE_TONES } from '@/constants/navigation'
import { ROLE_LABELS, ROLES } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import LoadingState from '@/components/ui/LoadingState'
import { formatClinicDate, formatClinicDateTime } from '@/utils/clinicTime'
import { usePatientProfile } from '../hooks/usePatientProfile'

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value || '—'}</dd>
    </div>
  )
}

/** Mi perfil: datos de la sesión (GET /auth/me) y, para pacientes, los datos del registro clínico. */
function PatientProfilePage() {
  const { user } = useAuth()
  const { patient, isLoading, error } = usePatientProfile(user.role === ROLES.PATIENT)

  return (
    <PageContainer narrow>
      <PageHeader eyebrow="Mi cuenta" title="Mi perfil" description="Datos personales y de contacto registrados en la clínica." />

      <Card title="Cuenta" description="Datos con los que inicia sesión.">
        <dl className="grid gap-5 sm:grid-cols-3">
          <Field label="Nombre" value={user.fullName} />
          <Field label="Correo" value={user.email} />
          <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">Rol</dt>
            <dd className="mt-1">
              <StatusBadge tone={ROLE_TONES[user.role]}>{ROLE_LABELS[user.role] ?? user.role}</StatusBadge>
            </dd>
          </div>
        </dl>
      </Card>

      {isLoading && <LoadingState label="Cargando sus datos…" />}
      {error && <Alert tone="error" title="No se pudieron cargar sus datos">{error}</Alert>}

      {patient && (
        <Card
          title="Datos del paciente"
          description="Para corregir sus datos, comuníquese con recepción."
          actions={
            <Button variant="secondary" size="sm" icon="edit" disabled title="Disponible próximamente">
              Editar
            </Button>
          }
        >
          <dl className="grid gap-5 sm:grid-cols-2">
            <Field label="Identificación" value={patient.identification} />
            <Field label="Fecha de nacimiento" value={patient.birthDate ? formatClinicDate(patient.birthDate) : null} />
            <Field label="Teléfono" value={patient.phone} />
            <Field label="Correo de contacto" value={patient.email} />
            <Field label="Contacto de emergencia" value={patient.emergencyContact} />
            <Field
              label="Consentimiento de datos"
              value={patient.dataConsentAt ? `Aceptado el ${formatClinicDateTime(patient.dataConsentAt)}` : 'Pendiente'}
            />
          </dl>
        </Card>
      )}

      <Alert tone="info">
        El cambio de contraseña y la edición de datos desde el portal estarán disponibles en una próxima versión.
      </Alert>
    </PageContainer>
  )
}

export default PatientProfilePage
