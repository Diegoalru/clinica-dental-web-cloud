import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

function NotFound() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 text-center">
      <p className="text-6xl font-bold tracking-tight text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Página no encontrada</h1>
      <p className="mt-2 text-slate-600">La ruta que busca no existe o fue movida.</p>
      <Button as={Link} to={ROUTES.HOME} className="mt-8" icon="arrow-left">
        Volver al inicio
      </Button>
    </section>
  )
}

export default NotFound
