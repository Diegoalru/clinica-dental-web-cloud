import { Link, Outlet } from 'react-router'

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-700">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-sky-700">
            Clinica Dental
          </Link>
          <button
            type="button"
            disabled
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white opacity-60"
          >
            Iniciar sesión
          </button>
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
