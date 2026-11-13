import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'

// Página de inicio con sesión. Por ahora solo muestra lo que devuelve el API (GET /auth/me);
// aquí irán los accesos a los módulos según el rol.
function Dashboard() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">Hola, {user.fullName}</h1>
      <dl className="mt-6 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="font-medium text-slate-500">Rol</dt>
        <dd>{ROLE_LABELS[user.role] ?? user.role}</dd>
        <dt className="font-medium text-slate-500">Correo</dt>
        <dd>{user.email}</dd>
      </dl>
    </section>
  )
}

export default Dashboard
