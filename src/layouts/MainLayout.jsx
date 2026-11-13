import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import StatusBadge from '@/components/ui/StatusBadge'
import { NAV_BY_ROLE, ROLE_TONES } from '@/constants/navigation'
import { ROLE_LABELS } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

const navLinkClasses = ({ isActive }) =>
  `inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

const mobileLinkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'
  }`

function MainLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  // No hace falta navegar al cerrar sesión: en una página protegida ProtectedRoute envía al login,
  // y en una pública el usuario se queda donde estaba.
  const navItems = isAuthenticated ? (NAV_BY_ROLE[user.role] ?? []) : []
  const initial = user?.fullName?.trim().charAt(0).toUpperCase() ?? ''

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 text-slate-900">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Icon name="tooth" size={20} />
            </span>
            <span className="text-base font-semibold tracking-tight">Clínica Dental</span>
          </Link>

          {/* Mientras se comprueba la sesión no se muestra nada, para no enseñar "Iniciar sesión" por un instante */}
          {!isLoading && (
            <>
              {isAuthenticated && navItems.length > 0 && (
                <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 md:flex">
                  {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} end className={navLinkClasses}>
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              )}

              <div className="ml-auto flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="hidden items-center gap-2.5 rounded-lg py-1 pr-2 pl-1 hover:bg-slate-100 md:flex"
                    >
                      <span
                        className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800"
                        aria-hidden="true"
                      >
                        {initial}
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-medium text-slate-900">{user.fullName}</span>
                        {/* Diferenciación visual del rol; data-role permite darle estilos por rol */}
                        <StatusBadge tone={ROLE_TONES[user.role]} dot={false} size="xs" data-role={user.role} className="mt-0.5 w-fit">
                          {ROLE_LABELS[user.role] ?? user.role}
                        </StatusBadge>
                      </span>
                    </Link>
                    <Button variant="secondary" size="sm" icon="log-out" onClick={logout} className="hidden md:inline-flex">
                      Cerrar sesión
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setMenuOpen((open) => !open)}
                      aria-expanded={menuOpen}
                      aria-controls="mobile-menu"
                      aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                      <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to={ROUTES.REGISTER} variant="ghost" size="sm">
                      Registrarse
                    </Button>
                    <Button as={Link} to={ROUTES.LOGIN} size="sm">
                      Iniciar sesión
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Menú móvil */}
        {isAuthenticated && menuOpen && (
          <div id="mobile-menu" className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <Link to={ROUTES.DASHBOARD} onClick={closeMenu} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-100">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                {initial}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-slate-900">{user.fullName}</span>
                <span className="text-xs text-slate-500">{ROLE_LABELS[user.role] ?? user.role}</span>
              </span>
            </Link>
            <nav aria-label="Principal (móvil)" className="mt-2 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end onClick={closeMenu} className={mobileLinkClasses}>
                  <Icon name={item.icon} size={18} className="text-slate-400" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Button variant="secondary" icon="log-out" onClick={logout} className="mt-3 w-full">
              Cerrar sesión
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 Clínica Dental · Proyecto académico
      </footer>
    </div>
  )
}

export default MainLayout
