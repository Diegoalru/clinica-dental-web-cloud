import Icon from '@/components/ui/Icon'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDateTimeLog } from '@/utils/dateLabels'

/** Bitácora de una cita: estado anterior → nuevo, usuario, fecha y observación. */
function AppointmentLogTimeline({ logs }) {
  if (!logs?.length) {
    return <p className="text-sm text-slate-500">Sin cambios registrados.</p>
  }

  return (
    <ol className="space-y-4">
      {logs.map((log) => (
        <li key={log.id} className="relative flex gap-3">
          <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Icon name="refresh" size={12} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              {log.previousStatus ? <StatusBadge status={log.previousStatus} size="xs" /> : <span className="text-slate-400">—</span>}
              <Icon name="arrow-right" size={14} className="text-slate-400" />
              <StatusBadge status={log.newStatus} size="xs" />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {formatDateTimeLog(log.changedAt)} · {log.changedBy}
            </p>
            {log.remarks && <p className="mt-1 text-sm text-slate-700">{log.remarks}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default AppointmentLogTimeline
