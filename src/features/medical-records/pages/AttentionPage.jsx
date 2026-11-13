import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Breadcrumb from '@/components/common/Breadcrumb'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'
import { ROUTES } from '@/constants/routes'
import { ageFromBirthDate, formatTime24 } from '@/utils/dateLabels'
import { MOCK_TODAY, findAppointment } from '@/features/appointments/mocks/appointments'
import MedicalRecordForm from '../components/MedicalRecordForm'
import PreviousRecordsList from '../components/PreviousRecordsList'
import { useMedicalRecordForm } from '../hooks/useMedicalRecordForm'
import { medicalRecords, recordsByPatient } from '../mocks/medicalRecords'

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
    </div>
  )
}

/** Atención y expediente (odontólogo): datos del paciente, antecedentes y formulario del expediente. */
function AttentionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  // TODO(api): appointmentsService.get(id) y medicalRecordsService.listByPatient(patientId)
  const appointment = findAppointment(id)
  const [started, setStarted] = useState(false)
  const [noShowOpen, setNoShowOpen] = useState(false)

  const form = useMedicalRecordForm({
    appointmentId: appointment?.id,
    onSaved: () =>
      navigate(ROUTES.DENTIST_AGENDA, {
        state: { message: 'Expediente guardado y cita marcada como Completada. Se registró en la bitácora.' },
      }),
  })

  if (!appointment) {
    return (
      <PageContainer>
        <EmptyState
          icon="calendar"
          title="Cita no encontrada"
          description={`No existe la cita #${id}.`}
          action={
            <Button as={Link} to={ROUTES.DENTIST_AGENDA} variant="secondary" icon="arrow-left">
              Volver a la agenda
            </Button>
          }
        />
      </PageContainer>
    )
  }

  const { patient, service } = appointment
  const previous = recordsByPatient(patient.id).filter((record) => record.appointmentId !== appointment.id)
  const existingRecord = medicalRecords.find((record) => record.appointmentId === appointment.id)
  const isCompleted = appointment.status === APPOINTMENT_STATUS.COMPLETED
  const isClosed = [APPOINTMENT_STATUS.NO_SHOW, APPOINTMENT_STATUS.CANCELLED].includes(appointment.status)
  const canAttend = !isCompleted && !isClosed

  const confirmNoShow = () => {
    // TODO(api): appointmentsService.markNoShow(appointment.id)
    setNoShowOpen(false)
    navigate(ROUTES.DENTIST_AGENDA, {
      state: { message: `Cita de ${patient.fullName} marcada como No asistió. Se registró en la bitácora.` },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Mi agenda', to: ROUTES.DENTIST_AGENDA },
              { label: `Cita #${appointment.id} · ${formatTime24(appointment.startsAt)} · ${service.name}` },
            ]}
          />
        }
        title={
          <span className="flex flex-wrap items-center gap-3">
            {patient.fullName}
            {canAttend && started ? (
              <StatusBadge tone="sky">En atención</StatusBadge>
            ) : (
              <StatusBadge status={appointment.status} />
            )}
          </span>
        }
        actions={
          canAttend && (
            <>
              <Button variant="danger-outline" onClick={() => setNoShowOpen(true)}>
                Paciente no se presentó
              </Button>
              {!started && (
                <Button icon="activity" onClick={() => setStarted(true)}>
                  Iniciar atención
                </Button>
              )}
            </>
          )
        }
      />

      {isClosed && (
        <Alert tone="warning" title="Esta cita está cerrada sin expediente.">
          La cita quedó en estado «{appointment.status === APPOINTMENT_STATUS.NO_SHOW ? 'No asistió' : 'Cancelada'}» y se registró en
          la bitácora. No se puede documentar una atención.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="space-y-6">
          <Card title="Datos del paciente">
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Identificación" value={patient.identification} />
              <Field label="Edad" value={patient.birthDate ? `${ageFromBirthDate(patient.birthDate, MOCK_TODAY)} años` : null} />
              <Field label="Teléfono" value={patient.phone} />
              <Field label="Emergencia" value={patient.emergencyContact} />
            </dl>
          </Card>

          <Card title="Antecedentes" description="Expedientes previos del paciente.">
            <PreviousRecordsList records={previous} />
          </Card>

          {canAttend && (
            <Alert tone="info">
              <strong>Si el paciente no se presenta:</strong> la cita pasa a «No asistió», se registra en la bitácora y no se crea
              expediente.
            </Alert>
          )}
        </div>

        <Card
          title={isCompleted ? 'Expediente de la atención (guardado)' : 'Expediente de la atención'}
          description={canAttend && !started ? 'Pulse «Iniciar atención» para habilitar el formulario.' : undefined}
        >
          {isCompleted && existingRecord ? (
            <dl className="space-y-3 text-sm">
              {[
                ['Síntomas / motivo de consulta', existingRecord.symptoms],
                ['Examen físico', existingRecord.physicalExam],
                ['Diagnóstico', existingRecord.diagnosis],
                ['Plan de tratamiento', existingRecord.treatmentPlan],
                ['Prescripciones', existingRecord.prescriptions],
                ['Notas clínicas', existingRecord.clinicalNotes],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
                  <dd className="mt-0.5 text-slate-800">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          ) : isCompleted || isClosed ? (
            <p className="text-sm text-slate-500">No hay expediente asociado a esta cita.</p>
          ) : (
            <>
              <MedicalRecordForm id="medical-record-form" disabled={!started} {...form} />

              <div className="mt-5 border-t border-slate-100 pt-4">
                <Button variant="link" disabled title="La programa recepción al cerrar la atención">
                  Programar cita de seguimiento
                </Button>
                <p className="text-xs text-slate-500">
                  Recepción abre el agendamiento con este paciente y odontólogo al cerrar la atención.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <Button as={Link} to={ROUTES.DENTIST_AGENDA} variant="secondary">
                  Volver a la agenda
                </Button>
                <Button type="submit" form="medical-record-form" icon="check" disabled={!started} loading={form.isSubmitting}>
                  Guardar expediente y completar cita
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>

      <Modal
        open={noShowOpen}
        onClose={() => setNoShowOpen(false)}
        title="Marcar como «No asistió»"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNoShowOpen(false)}>
              Volver
            </Button>
            <Button variant="danger" onClick={confirmNoShow}>
              Sí, no se presentó
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700">
          La cita de <strong>{patient.fullName}</strong> de las {formatTime24(appointment.startsAt)} pasará a «No asistió», se
          registrará en la bitácora y no se creará expediente.
        </p>
      </Modal>
    </PageContainer>
  )
}

export default AttentionPage
