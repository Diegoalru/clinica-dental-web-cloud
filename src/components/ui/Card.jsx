/**
 * Contenedor blanco con borde. Con `title` pinta un encabezado (título, descripción y acciones a la derecha).
 * `padding={false}` deja el contenido pegado al borde (tablas, listas).
 */
function Card({
  as: Component = 'section',
  title,
  description,
  actions,
  padding = true,
  className = '',
  headerClassName = '',
  children,
  ...props
}) {
  const hasHeader = title || description || actions
  return (
    <Component
      className={`rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}
      {...props}
    >
      {hasHeader && (
        <header
          className={`flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 ${headerClassName}`}
        >
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={padding ? 'p-5' : ''}>{children}</div>
    </Component>
  )
}

export default Card
