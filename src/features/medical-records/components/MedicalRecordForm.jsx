import Alert from '@/components/ui/Alert'
import Textarea from '@/components/ui/Textarea'

/** Campos del expediente. Solo pinta lo que devuelve useMedicalRecordForm. */
function MedicalRecordForm({ id, field, errors, hasErrors, formError, onSubmit, disabled = false }) {
  return (
    <form id={id} onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-xs text-slate-500">* obligatorio</p>
      {formError && <Alert tone="error">{formError}</Alert>}
      {hasErrors && !formError && (
        <Alert tone="error" title="Faltan campos obligatorios.">
          Complete el examen físico, el diagnóstico y el plan de tratamiento para guardar.
        </Alert>
      )}

      <fieldset disabled={disabled} className="space-y-4 disabled:opacity-60">
        <Textarea label="Síntomas / motivo de consulta" rows={2} error={errors.symptoms?.message} {...field('symptoms')} />
        <Textarea
          label="Examen físico *"
          rows={3}
          placeholder="Hallazgos del examen clínico…"
          error={errors.physicalExam?.message}
          {...field('physicalExam')}
        />
        <Textarea label="Diagnóstico *" rows={2} error={errors.diagnosis?.message} {...field('diagnosis')} />
        <Textarea
          label="Plan de tratamiento *"
          rows={3}
          placeholder="Procedimientos, controles y seguimiento…"
          error={errors.treatmentPlan?.message}
          {...field('treatmentPlan')}
        />
        <Textarea label="Prescripciones" rows={2} error={errors.prescriptions?.message} {...field('prescriptions')} />
        <Textarea label="Notas clínicas" rows={3} error={errors.clinicalNotes?.message} {...field('clinicalNotes')} />
      </fieldset>
    </form>
  )
}

export default MedicalRecordForm
