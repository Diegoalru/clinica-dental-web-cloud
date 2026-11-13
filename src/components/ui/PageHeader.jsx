/**
 * Encabezado de página: migas opcionales, "eyebrow" (texto pequeño arriba), título, descripción y acciones.
 */
function PageHeader({ eyebrow, title, description, actions, breadcrumb, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {breadcrumb}
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-slate-500 sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export default PageHeader
