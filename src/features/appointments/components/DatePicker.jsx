import { useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import {
  WEEKDAY_LETTER,
  daysInMonth,
  formatMonthYear,
  isoWeekday,
  joinIsoDate,
  splitIsoDate,
} from '@/utils/dateLabels'

/**
 * Calendario mensual. `value`: "AAAA-MM-DD" seleccionado; `minDate`: no se puede elegir antes;
 * `isDayDisabled(iso)`: días sin atención o bloqueados.
 */
function DatePicker({ value, onChange, minDate, isDayDisabled, className = '' }) {
  const initial = splitIsoDate(value ?? minDate)
  const [view, setView] = useState({ year: initial.year, month: initial.month })

  const moveMonth = (delta) => {
    setView((current) => {
      let month = current.month + delta
      let year = current.year
      if (month < 1) {
        month = 12
        year -= 1
      } else if (month > 12) {
        month = 1
        year += 1
      }
      return { year, month }
    })
  }

  const total = daysInMonth(view.year, view.month)
  const firstWeekday = isoWeekday(joinIsoDate(view.year, view.month, 1))
  const cells = [...Array(firstWeekday - 1).fill(null), ...Array.from({ length: total }, (_, index) => index + 1)]

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <Button variant="secondary" size="icon-sm" onClick={() => moveMonth(-1)} aria-label="Mes anterior">
          <Icon name="chevron-left" size={16} />
        </Button>
        <p className="text-sm font-semibold text-slate-900">{formatMonthYear(view.year, view.month)}</p>
        <Button variant="secondary" size="icon-sm" onClick={() => moveMonth(1)} aria-label="Mes siguiente">
          <Icon name="chevron-right" size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LETTER.map((letter, index) => (
          <span key={letter} className="text-xs font-semibold text-slate-400" aria-hidden="true">
            {letter}
            <span className="sr-only">{['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][index]}</span>
          </span>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />
          const iso = joinIsoDate(view.year, view.month, day)
          const disabled = (minDate && iso < minDate) || Boolean(isDayDisabled?.(iso))
          const selected = iso === value
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={iso}
              onClick={() => onChange(iso)}
              className={`h-10 rounded-lg text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600 ${
                selected
                  ? 'bg-brand-600 font-bold text-white'
                  : disabled
                    ? 'cursor-not-allowed bg-slate-50 text-slate-300'
                    : 'border border-slate-200 bg-white text-slate-800 hover:border-brand-400 hover:bg-brand-50'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-slate-300 bg-white" aria-hidden="true" />
          Con espacios
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-slate-100" aria-hidden="true" />
          Sin atención / bloqueado
        </span>
      </div>
    </div>
  )
}

export default DatePicker
