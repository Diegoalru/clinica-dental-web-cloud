/**
 * Barra de resumen del agendamiento: pares etiqueta/valor y acciones a la derecha.
 * `items`: [{ label, value }]; `actions`: botones.
 */
function BookingSummary({ items, actions, children, className = '' }) {
  return (
    <section
      aria-label="Resumen"
      className={`rounded-xl border-2 border-brand-200 bg-white px-5 py-4 shadow-xs ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{item.label}</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{item.value ?? '—'}</p>
          </div>
        ))}
        {actions && <div className="ml-auto flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  )
}

export default BookingSummary
