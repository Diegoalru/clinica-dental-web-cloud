import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'

// A dónde envía ProtectedRoute cuando el rol del usuario no puede abrir una página.
function Forbidden() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 text-center">
      <p className="text-5xl font-bold text-sky-600">403</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Acceso denegado</h1>
      <p className="mt-2 text-slate-600">Su rol no tiene permiso para ver esta página.</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-6 inline-block rounded-md bg-sky-600 px-4 py-2 font-medium text-white"
      >
        Volver al inicio
      </Link>
    </section>
  )
}

export default Forbidden
