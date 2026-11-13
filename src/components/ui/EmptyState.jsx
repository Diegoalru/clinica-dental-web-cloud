import Icon from './Icon'

/** Estado vacío para listas y tablas: icono, título, texto y una acción opcional. */
function EmptyState({ icon = 'search', title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center px-6 py-12 text-center ${className}`}>
      <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon name={icon} size={22} />
      </span>
      <p className="mt-4 text-base font-semibold text-slate-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState
