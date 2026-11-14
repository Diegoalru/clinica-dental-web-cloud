import { Link } from 'react-router'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_TONES } from '@/constants/appointmentStatus'
import { TONE_BLOCK_CLASSES } from '@/components/ui/tones'
import { receptionAppointmentRoute } from '@/constants/routes'
import { getClinicParts } from '@/utils/clinicTime'
import { formatTimeRange } from '@/utils/dateLabels'

const START_HOUR = 8
const END_HOUR = 17
const HOUR_HEIGHT = 64 // px por hora
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index)

const minutesFrom = (value) => {
  const { hour, minute } = getClinicParts(value)
  return (hour - START_HOUR) * 60 + minute
}

const blockStyle = (startsAt, endsAt) => {
  const top = (minutesFrom(startsAt) / 60) * HOUR_HEIGHT
  const height = Math.max(((minutesFrom(endsAt) - minutesFrom(startsAt)) / 60) * HOUR_HEIGHT, 24)
  return { top: `${top}px`, height: `${height - 2}px` }
}

/**
 * Agenda del día: una columna por odontólogo y filas por hora. Pinta citas (color por estado)
 * y bloqueos (rayado). `dentists`: [{ id, displayName, specialty, blocks }], `appointments` del día.
 */
function AgendaGrid({ dentists, appointments, date }) {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[640px]"
        style={{ gridTemplateColumns: `56px repeat(${dentists.length}, minmax(180px, 1fr))` }}
      >
        {/* Encabezados */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white" />
        {dentists.map((dentist) => (
          <div key={dentist.id} className="sticky top-0 z-10 border-b border-l border-slate-200 bg-white px-3 py-2">
            <p className="truncate text-sm font-semibold text-slate-900">{dentist.displayName}</p>
            <p className="truncate text-xs text-slate-500">{dentist.specialty}</p>
          </div>
        ))}

        {/* Columna de horas */}
        <div className="relative" style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}>
          {HOURS.map((hour, index) => (
            <span
              key={hour}
              className="absolute right-2 -translate-y-1/2 text-xs text-slate-400 tabular-nums"
              style={{ top: `${index * HOUR_HEIGHT}px` }}
            >
              {String(hour).padStart(2, '0')}:00
            </span>
          ))}
        </div>

        {/* Columnas por odontólogo */}
        {dentists.map((dentist) => {
          const items = appointments.filter((appointment) => appointment.dentist.id === dentist.id)
          const blocks = (dentist.blocks ?? []).filter((block) => block.startsAt.startsWith(date))
          return (
            <div
              key={dentist.id}
              className="relative border-l border-slate-200"
              style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
            >
              {HOURS.map((hour, index) => (
                <div
                  key={hour}
                  className="absolute inset-x-0 border-t border-slate-100"
                  style={{ top: `${index * HOUR_HEIGHT}px` }}
                  aria-hidden="true"
                />
              ))}

              {blocks.map((block) => (
                <div
                  key={`block-${block.id}`}
                  className={`absolute inset-x-1 rounded-md border-l-4 px-2 py-1 text-xs ${TONE_BLOCK_CLASSES.zinc}`}
                  style={blockStyle(block.startsAt, block.endsAt)}
                  title={`Bloqueo · ${block.reason}`}
                >
                  <p className="truncate font-semibold">Bloqueo · {block.reason}</p>
                  <p className="truncate">{formatTimeRange(block.startsAt, block.endsAt)}</p>
                </div>
              ))}

              {items.map((appointment) => {
                const tone = APPOINTMENT_STATUS_TONES[appointment.status]
                return (
                  <Link
                    key={appointment.id}
                    to={receptionAppointmentRoute(appointment.id)}
                    className={`absolute inset-x-1 overflow-hidden rounded-md border-l-4 px-2 py-1 text-xs shadow-xs transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-brand-600 ${TONE_BLOCK_CLASSES[tone]}`}
                    style={blockStyle(appointment.startsAt, appointment.endsAt)}
                    title={`${appointment.patient.fullName} · ${appointment.service.name} · ${APPOINTMENT_STATUS_LABELS[appointment.status]}`}
                  >
                    <p className="truncate font-semibold">{appointment.patient.fullName}</p>
                    <p className="truncate">
                      {appointment.service.name.split(' ')[0]} · {APPOINTMENT_STATUS_LABELS[appointment.status]}
                    </p>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AgendaGrid
