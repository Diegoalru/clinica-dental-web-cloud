import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

function ErrorPage() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Ocurrió un error inesperado.'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Algo salió mal
      </h1>
      <p className="mt-2 text-slate-600">{detail}</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-sky-600 px-4 py-2 font-medium text-white"
      >
        Volver al inicio
      </Link>
    </main>
  )
}

export default ErrorPage
