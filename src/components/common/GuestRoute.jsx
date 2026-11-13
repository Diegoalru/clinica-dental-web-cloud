import { Navigate, Outlet, useLocation } from 'react-router'
import LoadingState from '@/components/ui/LoadingState'
import { resolvePostLoginDestination } from '@/constants/routeAccess'
import { useAuth } from '@/hooks/useAuth'

/**
 * Ruta solo para visitantes (login y registro): quien ya tiene sesión sale de aquí.
 * También es lo que redirige justo después de iniciar sesión o registrarse, de vuelta a la página
 * que el usuario quería abrir (la guarda ProtectedRoute en location.state.from) o al inicio.
 *
 * El destino recordado solo se usa si el rol de quien entró puede abrirlo: pudo guardarlo otra persona
 * (cerró sesión en esa pestaña) o la portada (botón "Agendar cita", que es solo para pacientes).
 */
function GuestRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState />
  }

  if (isAuthenticated) {
    return <Navigate to={resolvePostLoginDestination(location.state?.from, user.role)} replace />
  }

  return <Outlet />
}

export default GuestRoute
