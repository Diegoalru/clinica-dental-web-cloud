import { Link, Outlet } from 'react-router'
import { ROLE_LABELS } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

function MainLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // No hace falta navegar al cerrar sesión: en una página protegida ProtectedRoute envía al login,
  // y en una pública el usuario se queda donde estaba.

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-700">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to={ROUTES.HOME} className="text-lg font-semibold text-sky-700">
            Clinica Dental
          </Link>

          {/* Mientras se comprueba la sesión no se muestra nada, para no enseñar "Iniciar sesión" por un instante */}
          {!isLoading && (
            <nav className="flex flex-wrap items-center gap-3 text-sm">
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.DASHBOARD} className="font-medium text-slate-900">
                    {user.fullName}
                  </Link>
                  {/* Diferenciación visual del rol; data-role permite darle un color a cada uno */}
                  <span
                    data-role={user.role}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                  >
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-md border border-slate-300 px-3 py-1.5 font-medium"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.REGISTER} className="font-medium text-sky-700">
                    Registrarse
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    className="rounded-md bg-sky-600 px-4 py-2 font-medium text-white"
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        © 2026 Clinica Dental · Proyecto académico
      </footer>
    </div>
  )
}

export default MainLayout
