import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'

// A dónde envía ProtectedRoute cuando el rol del usuario no puede abrir una página.
function Forbidden() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <Icon name="lock" size={28} />
      </span>
      <p className="mt-6 text-sm font-semibold tracking-wide text-rose-600 uppercase">Error 403</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Acceso denegado</h1>
      <p className="mt-2 text-slate-600">Su rol no tiene permiso para ver esta página.</p>
      <Button as={Link} to={ROUTES.DASHBOARD} className="mt-8" icon="arrow-left">
        Volver al inicio
      </Button>
    </section>
  )
}

export default Forbidden
