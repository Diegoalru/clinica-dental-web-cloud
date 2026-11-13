import { Navigate, Outlet, useLocation } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

/**
 * Ruta solo para visitantes (login y registro): quien ya tiene sesión sale de aquí.
 * También es lo que redirige justo después de iniciar sesión o registrarse, de vuelta a la página
 * que el usuario quería abrir (la guarda ProtectedRoute en location.state.from) o al inicio.
 */
function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p className="px-4 py-16 text-center text-slate-500">Cargando…</p>
  }

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}

export default GuestRoute
