import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_LIST, APPOINTMENT_STATUS_TONES } from '@/constants/appointmentStatus'
import { TONE_DOT_CLASSES } from '@/components/ui/tones'

/**
 * Leyenda de colores. Por defecto lista los estados de cita; con `items` [{ label, tone?, className? }]
 * se puede extender (por ejemplo, "Bloqueo").
 */
function Legend({ items, title = 'Leyenda:', className = '' }) {
  const list =
    items ??
    APPOINTMENT_STATUS_LIST.map((status) => ({
      label: APPOINTMENT_STATUS_LABELS[status],
      tone: APPOINTMENT_STATUS_TONES[status],
    }))

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 ${className}`}>
      <span className="font-medium">{title}</span>
      {list.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            className={`size-3 rounded-sm ${item.className ?? TONE_DOT_CLASSES[item.tone] ?? TONE_DOT_CLASSES.slate}`}
            aria-hidden="true"
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}

export default Legend
