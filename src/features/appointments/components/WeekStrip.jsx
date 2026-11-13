import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { WEEKDAY_SHORT, addDays, splitIsoDate, startOfWeek } from '@/utils/dateLabels'

/**
 * Tira de 7 días (lunes a domingo) con el día seleccionado y, opcionalmente, un punto si hay citas.
 * `value`: "AAAA-MM-DD"; `countFor(iso)`: cantidad de citas del día (para el punto).
 */
function WeekStrip({ value, today, onChange, countFor }) {
  const monday = startOfWeek(value)
  const days = Array.from({ length: 7 }, (_, index) => addDays(monday, index))

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="icon-sm" onClick={() => onChange(addDays(value, -7))} aria-label="Semana anterior">
        <Icon name="chevron-left" size={16} />
      </Button>
      <Button variant="secondary" size="sm" onClick={() => onChange(today)}>
        Hoy
      </Button>
      <Button variant="secondary" size="icon-sm" onClick={() => onChange(addDays(value, 7))} aria-label="Semana siguiente">
        <Icon name="chevron-right" size={16} />
      </Button>
      <div className="ml-2 grid flex-1 grid-cols-7 gap-1">
        {days.map((iso, index) => {
          const selected = iso === value
          const isToday = iso === today
          const count = countFor?.(iso) ?? 0
          return (
            <button
              key={iso}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(iso)}
              className={`flex flex-col items-center rounded-lg py-1.5 text-xs transition-colors ${
                selected
                  ? 'bg-brand-600 text-white'
                  : isToday
                    ? 'bg-brand-50 text-brand-800 hover:bg-brand-100'
                    : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="font-medium uppercase">{WEEKDAY_SHORT[index]}</span>
              <span className="text-base font-semibold tabular-nums">{splitIsoDate(iso).day}</span>
              <span className={`mt-0.5 size-1.5 rounded-full ${count > 0 ? (selected ? 'bg-white' : 'bg-brand-500') : 'bg-transparent'}`} aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WeekStrip
