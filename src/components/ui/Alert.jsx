import Button from './Button'
import Icon from './Icon'

const TONES = {
  info: { classes: 'border-brand-200 bg-brand-50 text-brand-900', icon: 'info', role: 'status' },
  success: {
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: 'check-circle',
    role: 'status',
  },
  warning: {
    classes: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: 'alert-circle',
    role: 'status',
  },
  error: { classes: 'border-rose-200 bg-rose-50 text-rose-900', icon: 'alert-circle', role: 'alert' },
}

/** Aviso en línea. `tone`: info | success | warning | error. Con `onClose` muestra el botón de cerrar. */
function Alert({ tone = 'info', title, children, onClose, className = '' }) {
  const config = TONES[tone]
  return (
    <div
      role={config.role}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${config.classes} ${className}`}
    >
      <Icon name={config.icon} size={18} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>}
      </div>
      {onClose && (
        <Button variant="ghost" size="icon-sm" className="-my-1 -mr-2" onClick={onClose} aria-label="Cerrar aviso">
          <Icon name="x" size={16} />
        </Button>
      )}
    </div>
  )
}

export default Alert
