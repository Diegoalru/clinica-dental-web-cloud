import { Link } from 'react-router'
import Icon from '@/components/ui/Icon'

/** Migas de pan: `items`: [{ label, to? }]. El último elemento es la página actual. */
function Breadcrumb({ items, className = '' }) {
  return (
    <nav aria-label="Ubicación" className={`mb-2 text-sm text-slate-500 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link to={item.to} className="hover:text-brand-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-slate-700' : ''}>
                  {item.label}
                </span>
              )}
              {!last && <Icon name="chevron-right" size={14} className="text-slate-400" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
