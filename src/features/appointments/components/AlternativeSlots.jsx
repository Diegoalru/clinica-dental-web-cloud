import Alert from '@/components/ui/Alert'

/** Aviso con horarios alternativos en forma de chips. `onSelect(slot)` recibe { date, time, dentistId }. */
function AlternativeSlots({ title, description, slots, onSelect, tone = 'warning' }) {
  return (
    <Alert tone={tone} title={title}>
      {description && <p>{description}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot.label}
            type="button"
            onClick={() => onSelect?.(slot)}
            className="inline-flex h-9 items-center rounded-full border border-current/30 bg-white px-3.5 text-xs font-semibold text-slate-800 hover:border-brand-400 hover:bg-brand-50"
          >
            {slot.label}
          </button>
        ))}
      </div>
    </Alert>
  )
}

export default AlternativeSlots
