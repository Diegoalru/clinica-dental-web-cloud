import { Link } from 'react-router'
import PageContainer from '@/components/common/PageContainer'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import PageHeader from '@/components/ui/PageHeader'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import LoadingState from '@/components/ui/LoadingState'
import { ROUTES } from '@/constants/routes'
import { formatCurrency, formatDuration } from '@/utils/formatCurrency'
import { useServicesCatalog } from '../hooks/useServicesCatalog'

/** Catálogo de servicios para el paciente (solo activos). La lógica está en useServicesCatalog. */
function ServicesCatalogPage() {
  const { services: active, isLoading, error } = useServicesCatalog()

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Portal del paciente"
        title="Servicios"
        description="Duración y precio de referencia de cada servicio. El precio final se confirma en la clínica."
        actions={
          <Button as={Link} to={ROUTES.PATIENT_BOOK} icon="calendar">
            Agendar cita
          </Button>
        }
      />

      {error && <Alert tone="error" title="No se pudo cargar el catálogo">{error}</Alert>}
      {isLoading && <LoadingState label="Cargando servicios…" />}
      {!isLoading && !error && active.length === 0 && (
        <EmptyState icon="tooth" title="No hay servicios disponibles" description="Vuelva a intentarlo más tarde." />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((service) => (
          <article key={service.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Icon name="tooth" size={22} />
            </span>
            <h2 className="mt-4 text-base font-semibold text-slate-900">{service.name}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-500">{service.description}</p>
            <dl className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Icon name="clock" size={16} className="text-slate-400" />
                <dd>{formatDuration(service.durationMinutes)}</dd>
              </div>
              <dd className="font-semibold text-slate-900">{formatCurrency(service.price)}</dd>
            </dl>
          </article>
        ))}
      </div>
    </PageContainer>
  )
}

export default ServicesCatalogPage
