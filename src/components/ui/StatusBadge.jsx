import { describeStatus } from '@/constants/appointmentStatus'
import { TONE_CLASSES, TONE_DOT_CLASSES } from './tones'

/**
 * Insignia de estado. Con `status` resuelve etiqueta y tono desde las constantes
 * (PENDING, ACTIVE, SENT…); con `tone` + children se usa para cualquier otro texto.
 */
function StatusBadge({ status, tone, dot = true, size = 'sm', className = '', children, ...props }) {
  const resolved = status ? describeStatus(status) : { label: children, tone: tone ?? 'slate' }
  const finalTone = tone ?? resolved.tone
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ring-1 ring-inset ${TONE_CLASSES[finalTone] ?? TONE_CLASSES.slate} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`size-1.5 rounded-full ${TONE_DOT_CLASSES[finalTone] ?? TONE_DOT_CLASSES.slate}`}
          aria-hidden="true"
        />
      )}
      {children ?? resolved.label}
    </span>
  )
}

export default StatusBadge
