import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDuration } from '@/utils/formatCurrency'
import { formatShortDate, formatTime24 } from '@/utils/dateLabels'

/** Tarjeta de una cita próxima del paciente. */
function AppointmentCard({ appointment, onDetail }) {
  const { id, startsAt, status, service, dentist } = appointment
  return (
    <article className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-800">
        <span className="text-[11px] font-semibold uppercase">{formatShortDate(startsAt).split(' ')[0]}</span>
        <span className="text-xl leading-none font-bold">{formatShortDate(startsAt).split(' ')[1]}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          <span className="text-xs text-slate-400">#{id}</span>
        </div>
        <p className="mt-1 text-base font-semibold text-slate-900">
          {formatShortDate(startsAt)} · {formatTime24(startsAt)}
        </p>
        <p className="text-sm text-slate-600">
          {service.name} · {formatDuration(service.durationMinutes)}
        </p>
        <p className="text-sm text-slate-500">{dentist.displayName}</p>
      </div>
      <div className="flex w-full flex-wrap gap-2 sm:w-auto">
        <Button variant="secondary" size="sm" icon="eye" onClick={() => onDetail?.(appointment)}>
          Ver detalle
        </Button>
        <Button variant="ghost" size="sm" disabled title="Disponible próximamente">
          <Icon name="calendar" size={16} />
          Agregar al calendario
        </Button>
      </div>
    </article>
  )
}

export default AppointmentCard
