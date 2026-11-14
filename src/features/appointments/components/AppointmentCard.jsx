import StatusBadge from '@/components/ui/StatusBadge'
import { formatDuration } from '@/utils/formatCurrency'
import { formatShortDate, formatTime24 } from '@/utils/dateLabels'

/** Tarjeta de una cita próxima del paciente. */
function AppointmentCard({ appointment }) {
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

    </article>
  )
}

export default AppointmentCard
