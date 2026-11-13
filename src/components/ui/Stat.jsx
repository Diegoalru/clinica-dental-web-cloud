const TONES = {
  default: 'text-slate-900',
  sky: 'text-brand-700',
  amber: 'text-amber-700',
  emerald: 'text-emerald-700',
  rose: 'text-rose-700',
  slate: 'text-slate-500',
}

/** Indicador numérico (KPI): etiqueta, valor grande y una nota opcional debajo. */
function Stat({ label, value, note, tone = 'default', compact = false, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white ${compact ? 'px-4 py-3' : 'px-5 py-4'} ${className}`}
    >
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
      <p className={`mt-1 font-semibold tabular-nums ${compact ? 'text-2xl' : 'text-3xl'} ${TONES[tone]}`}>
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  )
}

export default Stat
