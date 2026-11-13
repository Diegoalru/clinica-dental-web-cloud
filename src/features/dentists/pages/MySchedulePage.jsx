import PageContainer from '@/components/common/PageContainer'
import Alert from '@/components/ui/Alert'
import Card from '@/components/ui/Card'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { services } from '@/features/services/mocks/services'
import BlocksTable from '../components/BlocksTable'
import WeeklyScheduleTable from '../components/WeeklyScheduleTable'
import { findDentist } from '../mocks/dentists'

/** Mi horario (odontólogo): horario semanal, bloqueos y servicios habilitados, en solo lectura. */
function MySchedulePage() {
  const { user } = useAuth()
  // TODO(api): dentistsService.me(). El mock usa el odontólogo 1.
  const dentist = findDentist(user.dentistId ?? 1)
  const enabledServices = services.filter((service) => dentist.serviceIds.includes(service.id))

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Odontólogo"
        title="Mi horario"
        description={`${dentist.specialty} · Licencia ${dentist.licenseNumber}`}
      />

      <Alert tone="info">Para cambiar su horario, bloqueos o servicios habilitados, comuníquese con la administración.</Alert>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card title="Horario semanal" padding={false}>
          <WeeklyScheduleTable schedules={dentist.schedules} />
        </Card>

        <div className="space-y-6">
          <Card title="Servicios habilitados" description="Solo estos servicios se pueden agendar con usted.">
            <ul className="flex flex-wrap gap-2">
              {enabledServices.map((service) => (
                <li key={service.id}>
                  <StatusBadge tone="sky" dot={false}>
                    {service.name}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Bloqueos próximos" padding={false}>
            <BlocksTable blocks={dentist.blocks} />
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

export default MySchedulePage
