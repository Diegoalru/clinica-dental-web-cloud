import { useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { formatDayMonthYear } from '@/utils/dateLabels'

/** Antecedentes: expedientes previos del paciente en acordeón (diagnóstico, tratamiento, notas). */
function PreviousRecordsList({ records, limit = 2 }) {
  const [openId, setOpenId] = useState(records[0]?.id ?? null)
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? records : records.slice(0, limit)

  if (records.length === 0) {
    return <p className="text-sm text-slate-500">Sin expedientes previos. Esta sería su primera atención registrada.</p>
  }

  return (
    <div className="space-y-2">
      {visible.map((record) => {
        const open = record.id === openId
        return (
          <article key={record.id} className="rounded-lg border border-slate-200">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : record.id)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-50"
            >
              <span className="font-semibold text-slate-900 tabular-nums">{formatDayMonthYear(record.date)}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-700">{record.serviceName}</span>
              <span className="text-slate-400">·</span>
              <span className="truncate text-slate-500">{record.dentistName}</span>
              <Icon name="chevron-down" size={16} className={`ml-auto text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <dl className="space-y-2 border-t border-slate-100 px-3 py-3 text-sm">
                {[
                  ['Diagnóstico', record.diagnosis],
                  ['Tratamiento', record.treatmentPlan],
                  ['Notas', record.clinicalNotes],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
                    <dd className="text-slate-800">{value || '—'}</dd>
                  </div>
                ))}
              </dl>
            )}
          </article>
        )
      })}
      {records.length > limit && (
        <Button variant="link" onClick={() => setShowAll((value) => !value)}>
          {showAll ? 'Ver menos' : 'Ver historial completo'}
        </Button>
      )}
    </div>
  )
}

export default PreviousRecordsList
