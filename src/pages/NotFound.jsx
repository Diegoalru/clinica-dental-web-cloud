import { Link } from 'react-router'

function NotFound() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 text-center">
      <p className="text-5xl font-bold text-sky-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        Página no encontrada
      </h1>
      <p className="mt-2 text-slate-600">La ruta que buscas no existe.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-sky-600 px-4 py-2 font-medium text-white"
      >
        Volver al inicio
      </Link>
    </section>
  )
}

export default NotFound
