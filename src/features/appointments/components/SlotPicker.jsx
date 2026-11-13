/**
 * Cuadrícula de horarios. `slots`: [{ time: 'HH:mm', available }], `value`: hora seleccionada.
 * Los ocupados se ven tachados y no se pueden elegir.
 */
function SlotPicker({ slots, value, onChange, columns = 3, emptyMessage = 'No hay horarios para este día.' }) {
  if (!slots.length) {
    return <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{emptyMessage}</p>
  }

  return (
    <div className={`grid gap-2 ${columns === 4 ? 'grid-cols-4' : columns === 5 ? 'grid-cols-5' : 'grid-cols-3'}`}>
      {slots.map((slot) => {
        const selected = slot.time === value
        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            aria-pressed={selected}
            onClick={() => onChange(slot.time)}
            className={`h-11 rounded-lg text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
              selected
                ? 'bg-brand-600 text-white shadow-xs'
                : slot.available
                  ? 'border border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50'
                  : 'cursor-not-allowed border border-dashed border-slate-300 bg-stripes text-slate-400 line-through'
            }`}
          >
            {slot.time}
          </button>
        )
      })}
    </div>
  )
}

export default SlotPicker
