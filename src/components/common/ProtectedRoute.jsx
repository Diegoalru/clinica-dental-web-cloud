import { Navigate, Outlet, useLocation } from 'react-router'
import LoadingState from '@/components/ui/LoadingState'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

/**
 * Ruta que exige sesión. Se usa como ruta padre en el router:
 *
 *   { element: <ProtectedRoute />, children: [...] }                      // cualquier usuario con sesión
 *   { element: <ProtectedRoute roles={STAFF_ROLES} />, children: [...] }  // solo esos roles
 *
 * Es comodidad para el usuario, no seguridad: quien autoriza de verdad es el API en cada solicitud.
 */
function ProtectedRoute({ roles }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingState />
  }

  if (!isAuthenticated) {
    // Se recuerda a dónde iba para volver ahí después de iniciar sesión
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname + location.search }} />
  }

  if (roles && !hasRole(...roles)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
