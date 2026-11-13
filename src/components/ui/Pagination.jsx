import Button from './Button'
import Icon from './Icon'

/** Paginación simple: "Mostrando 1–10 de 128" con botones anterior/siguiente. `page` empieza en 1. */
function Pagination({ page, pageSize, total, onChange, className = '' }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav
      aria-label="Paginación"
      className={`flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 ${className}`}
    >
      <p>
        Mostrando <span className="font-medium text-slate-700">{from}–{to}</span> de{' '}
        <span className="font-medium text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Página anterior">
          <Icon name="chevron-left" size={16} />
        </Button>
        <span className="px-2 tabular-nums">
          {page} / {pages}
        </span>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Página siguiente">
          <Icon name="chevron-right" size={16} />
        </Button>
      </div>
    </nav>
  )
}

export default Pagination
