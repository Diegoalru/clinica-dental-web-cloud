import { useMemo, useState } from 'react'
import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import StatusBadge from '@/components/ui/StatusBadge'
import Table, { Td, Th } from '@/components/ui/Table'
import Tabs from '@/components/ui/Tabs'
import { ROLE_TONES } from '@/constants/navigation'
import { ROLE_LABELS, ROLES } from '@/constants/roles'
import { maskEmail } from '@/utils/privacy'
import UserFormModal from '../components/UserFormModal'
import { users } from '../mocks/users'

/** Usuarios (administración): filtro por rol, búsqueda, tabla y modal de usuario. */
function UsersPage() {
  const [role, setRole] = useState('ALL')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState({ open: false, user: null })
  const [message, setMessage] = useState(null)

  // TODO(api): usersService.list({ search: query, role })
  const list = useMemo(() => {
    const text = query.trim().toLowerCase()
    return users.filter(
      (user) =>
        (role === 'ALL' || user.role === role) &&
        (!text || user.fullName.toLowerCase().includes(text) || user.email.toLowerCase().includes(text)),
    )
  }, [role, query])

  const tabs = [
    { value: 'ALL', label: 'Todos', count: users.length },
    ...Object.values(ROLES).map((value) => ({
      value,
      label: ROLE_LABELS[value],
      count: users.filter((user) => user.role === value).length,
    })),
  ]

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Administración"
        title="Usuarios"
        description="Cuentas de acceso y rol de cada persona."
        actions={
          <Button icon="plus" onClick={() => setModal({ open: true, user: null })}>
            Nuevo usuario
          </Button>
        }
      />

      {message && (
        <Alert tone="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      )}

      <Card padding={false}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar usuario" className="w-full sm:w-72" />
          <Tabs variant="pills" items={tabs} value={role} onChange={setRole} label="Filtrar por rol" className="sm:ml-auto" />
        </div>

        {list.length === 0 ? (
          <EmptyState icon="users" title="Sin usuarios" description="No hay usuarios con ese filtro." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>Correo</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{user.fullName}</Td>
                  <Td>{maskEmail(user.email)}</Td>
                  <Td>
                    <StatusBadge tone={ROLE_TONES[user.role]} dot={false}>
                      {ROLE_LABELS[user.role]}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <StatusBadge status={user.status} />
                  </Td>
                  <Td align="right">
                    <Button variant="ghost" size="sm" icon="edit" onClick={() => setModal({ open: true, user })}>
                      Editar
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <UserFormModal
        key={modal.user?.id ?? 'new'}
        open={modal.open}
        onClose={() => setModal({ open: false, user: null })}
        onSaved={(values) => {
          setModal({ open: false, user: null })
          setMessage(`Usuario ${values.fullName.trim()} guardado.`)
        }}
        initialValues={modal.user ? { ...modal.user, phone: modal.user.phone ?? '' } : undefined}
      />
    </PageContainer>
  )
}

export default UsersPage
