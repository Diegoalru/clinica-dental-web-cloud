import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import PageContainer from '@/components/common/PageContainer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import Table, { Td, Th } from '@/components/ui/Table'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'
import { dentistAttentionRoute } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { formatDayMonthYear } from '@/utils/dateLabels'
import { appointmentsByDentist } from '@/features/appointments/mocks/appointments'

/** Mis pacientes (odontólogo): pacientes atendidos, con su última visita y acceso al expediente. */
function DentistPatientsPage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')

  // TODO(api): patientsService.list({ dentistId: user.dentistId }). El mock los deriva de las citas completadas.
  const rows = useMemo(() => {
    const byPatient = new Map()
    appointmentsByDentist(user.dentistId ?? 1)
      .filter((item) => item.status === APPOINTMENT_STATUS.COMPLETED)
      .sort((a, b) => (a.startsAt < b.startsAt ? 1 : -1))
      .forEach((item) => {
        const current = byPatient.get(item.patient.id)
        if (current) {
          current.visits += 1
        } else {
          byPatient.set(item.patient.id, {
            patient: item.patient,
            lastAppointment: item,
            visits: 1,
          })
        }
      })
    const text = query.trim().toLowerCase()
    return [...byPatient.values()].filter(
      (row) => !text || row.patient.fullName.toLowerCase().includes(text) || row.patient.identification.includes(text),
    )
  }, [user.dentistId, query])

  return (
    <PageContainer>
      <PageHeader eyebrow="Odontólogo" title="Mis pacientes" description="Pacientes que ha atendido y sus expedientes." />

      <Card padding={false}>
        <div className="border-b border-slate-100 px-4 py-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar paciente" className="w-full sm:w-72" />
        </div>
        {rows.length === 0 ? (
          <EmptyState icon="users" title="Sin pacientes atendidos" description="Aparecerán aquí al completar una atención." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Paciente</Th>
                <Th>Identificación</Th>
                <Th>Última visita</Th>
                <Th align="center">Atenciones</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.patient.id} className="hover:bg-slate-50">
                  <Td className="font-medium text-slate-900">{row.patient.fullName}</Td>
                  <Td className="tabular-nums">{row.patient.identification}</Td>
                  <Td>
                    {formatDayMonthYear(row.lastAppointment.startsAt)}
                    <span className="block text-xs text-slate-500">{row.lastAppointment.service.name}</span>
                  </Td>
                  <Td align="center" className="tabular-nums">
                    {row.visits}
                  </Td>
                  <Td align="right">
                    <Button as={Link} to={dentistAttentionRoute(row.lastAppointment.id)} variant="ghost" size="sm" icon="file-text">
                      Ver expediente
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </PageContainer>
  )
}

export default DentistPatientsPage
