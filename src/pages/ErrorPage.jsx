import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'

// Pantalla para errores no controlados del árbol de rutas. Reemplaza al layout completo a propósito.
function ErrorPage() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Ocurrió un error inesperado.'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <Icon name="alert-circle" size={28} />
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-slate-900">Algo salió mal</h1>
      <p className="mt-2 text-slate-600">{detail}</p>
      <Button as={Link} to={ROUTES.HOME} className="mt-8" icon="arrow-left">
        Volver al inicio
      </Button>
    </main>
  )
}

export default ErrorPage
