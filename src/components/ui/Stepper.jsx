import Icon from './Icon'

/**
 * Indicador de pasos de un asistente. `steps`: ['Servicio', 'Odontólogo', …]; `current` empieza en 1.
 * Si se pasa `onSelect`, los pasos ya completados se pueden pulsar para volver.
 */
function Stepper({ steps, current, onSelect, className = '' }) {
  return (
    <ol className={`flex flex-wrap gap-x-6 gap-y-3 ${className}`} aria-label="Pasos">
      {steps.map((step, index) => {
        const number = index + 1
        const done = number < current
        const active = number === current
        const clickable = done && onSelect
        const content = (
          <>
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 ring-inset ${
                active
                  ? 'bg-brand-600 text-white ring-brand-600'
                  : done
                    ? 'bg-brand-50 text-brand-700 ring-brand-300'
                    : 'bg-white text-slate-400 ring-slate-300'
              }`}
              aria-hidden="true"
            >
              {done ? <Icon name="check" size={14} /> : number}
            </span>
            <span className={active ? 'font-semibold text-slate-900' : done ? 'text-slate-700' : 'text-slate-400'}>
              {step}
            </span>
          </>
        )
        return (
          <li key={step} aria-current={active ? 'step' : undefined} className="flex items-center gap-2 text-sm">
            {clickable ? (
              <button type="button" onClick={() => onSelect(number)} className="flex items-center gap-2 rounded-md hover:underline">
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default Stepper
