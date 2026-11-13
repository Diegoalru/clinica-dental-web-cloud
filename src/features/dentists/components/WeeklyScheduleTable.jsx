import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Table, { Td, Th } from '@/components/ui/Table'
import { WEEKDAY_LONG } from '@/utils/dateLabels'
import { INPUT_CLASSES } from '@/components/ui/fieldStyles'

const DAYS = [1, 2, 3, 4, 5, 6, 7]

/**
 * Horario semanal por día con varios tramos. `schedules`: [{ id, dayOfWeek, startTime, endTime }].
 * Con `editable` permite agregar, cambiar y quitar tramos (onAdd(day), onChange(id, campo, valor), onRemove(id)).
 */
function WeeklyScheduleTable({ schedules, editable = false, onAdd, onChange, onRemove }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Día</Th>
          <Th>Tramos</Th>
          {editable && <Th align="right">Acciones</Th>}
        </tr>
      </thead>
      <tbody>
        {DAYS.map((day) => {
          const rows = schedules.filter((item) => item.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
          return (
            <tr key={day}>
              <Td className="w-36 font-medium text-slate-900">{WEEKDAY_LONG[day - 1]}</Td>
              <Td>
                {rows.length === 0 ? (
                  <span className="text-slate-400">Sin atención</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {rows.map((row) =>
                      editable ? (
                        <span key={row.id} className="inline-flex items-center gap-1.5">
                          <input
                            type="time"
                            value={row.startTime}
                            aria-label={`Inicio ${WEEKDAY_LONG[day - 1]}`}
                            onChange={(event) => onChange(row.id, 'startTime', event.target.value)}
                            className={`${INPUT_CLASSES} h-9 w-28 px-2 text-sm`}
                          />
                          <span className="text-slate-400">–</span>
                          <input
                            type="time"
                            value={row.endTime}
                            aria-label={`Fin ${WEEKDAY_LONG[day - 1]}`}
                            onChange={(event) => onChange(row.id, 'endTime', event.target.value)}
                            className={`${INPUT_CLASSES} h-9 w-28 px-2 text-sm`}
                          />
                          <Button variant="ghost" size="icon-sm" onClick={() => onRemove(row.id)} aria-label="Quitar tramo">
                            <Icon name="x" size={14} />
                          </Button>
                        </span>
                      ) : (
                        <span key={row.id} className="rounded-md bg-slate-100 px-2 py-1 text-sm tabular-nums text-slate-700">
                          {row.startTime} – {row.endTime}
                        </span>
                      ),
                    )}
                  </div>
                )}
              </Td>
              {editable && (
                <Td align="right">
                  <Button variant="ghost" size="sm" icon="plus" onClick={() => onAdd(day)}>
                    Tramo
                  </Button>
                </Td>
              )}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default WeeklyScheduleTable
