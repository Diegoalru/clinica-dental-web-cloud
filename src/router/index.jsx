import { createBrowserRouter } from 'react-router'
import GuestRoute from '@/components/common/GuestRoute'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { ROUTES } from '@/constants/routes'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import MainLayout from '@/layouts/MainLayout'
import Dashboard from '@/pages/Dashboard'
import ErrorPage from '@/pages/ErrorPage'
import Forbidden from '@/pages/Forbidden'
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Públicas
      { index: true, element: <Landing /> },

      // Solo sin sesión: con sesión redirigen al inicio
      {
        element: <GuestRoute />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
        ],
      },

      // Cualquier usuario con sesión
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.DASHBOARD, element: <Dashboard /> },
          { path: ROUTES.FORBIDDEN, element: <Forbidden /> },
        ],
      },

      // Para limitar por rol se agrega otro grupo, por ejemplo:
      // { element: <ProtectedRoute roles={STAFF_ROLES} />, children: [{ path: '/pacientes', element: <PatientsPage /> }] },

      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
