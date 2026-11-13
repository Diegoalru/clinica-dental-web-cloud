import Icon from '@/components/ui/Icon'

/** Opción seleccionable (servicio u odontólogo) con icono o inicial, título y detalle. */
function OptionCard({ selected, onClick, title, detail, icon, initial, round = false, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 ${
        selected
          ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
          : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center ${round ? 'rounded-full' : 'rounded-lg'} ${
          selected ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'
        } text-sm font-semibold`}
        aria-hidden="true"
      >
        {icon ? <Icon name={icon} size={18} /> : initial}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-900">{title}</span>
        {detail && <span className="block truncate text-xs text-slate-500">{detail}</span>}
      </span>
      {selected && <Icon name="check" size={18} className="text-brand-600" />}
    </button>
  )
}

export default OptionCard
