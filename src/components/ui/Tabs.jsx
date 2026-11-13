/**
 * Pestañas controladas. `items`: [{ value, label, count? }]. `variant`: 'underline' (secciones) o 'pills' (filtros).
 */
function Tabs({ items, value, onChange, variant = 'underline', label, className = '' }) {
  const isPills = variant === 'pills'
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`flex gap-1 overflow-x-auto ${isPills ? '' : 'border-b border-slate-200'} ${className}`}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={
              isPills
                ? `inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-50'
                  }`
                : `-mb-px inline-flex h-11 shrink-0 items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition-colors ${
                    active
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`
            }
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  active && isPills ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
