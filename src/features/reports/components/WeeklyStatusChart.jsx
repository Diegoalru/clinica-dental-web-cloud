const SERIES = [
  { key: 'completed', label: 'Atendidas', color: 'fill-emerald-500' },
  { key: 'cancelled', label: 'Canceladas', color: 'fill-slate-400' },
  { key: 'noShow', label: 'No asistidas', color: 'fill-rose-400' },
]

const WIDTH = 640
const HEIGHT = 260
const PADDING = { top: 16, right: 16, bottom: 36, left: 40 }

/** Barras apiladas por semana y estado, en SVG puro (sin librerías). `data`: [{ label, completed, cancelled, noShow }]. */
function WeeklyStatusChart({ data }) {
  const innerWidth = WIDTH - PADDING.left - PADDING.right
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom
  const totals = data.map((week) => SERIES.reduce((sum, serie) => sum + week[serie.key], 0))
  const maxTotal = Math.max(...totals, 1)
  const step = maxTotal > 40 ? 20 : 10
  const axisMax = Math.ceil(maxTotal / step) * step
  const ticks = Array.from({ length: axisMax / step + 1 }, (_, index) => index * step)
  const slot = innerWidth / data.length
  const barWidth = Math.min(slot * 0.55, 56)
  const y = (value) => PADDING.top + innerHeight - (value / axisMax) * innerHeight

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Citas por semana y estado" className="h-auto w-full">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y(tick)} y2={y(tick)} className="stroke-slate-200" strokeDasharray={tick === 0 ? undefined : '3 3'} />
            <text x={PADDING.left - 8} y={y(tick) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
              {tick}
            </text>
          </g>
        ))}
        {data.map((week, index) => {
          const x = PADDING.left + slot * index + (slot - barWidth) / 2
          let cursor = 0
          return (
            <g key={week.label}>
              {SERIES.map((serie) => {
                const value = week[serie.key]
                const top = y(cursor + value)
                const height = y(cursor) - top
                cursor += value
                return (
                  <rect key={serie.key} x={x} y={top} width={barWidth} height={height} className={serie.color} rx={2}>
                    <title>{`${week.label} · ${serie.label}: ${value}`}</title>
                  </rect>
                )
              })}
              <text x={x + barWidth / 2} y={HEIGHT - PADDING.bottom + 18} textAnchor="middle" className="fill-slate-500 text-[11px]">
                {week.label}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
        {SERIES.map((serie) => (
          <span key={serie.key} className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" aria-hidden="true">
              <rect width="12" height="12" rx="2" className={serie.color} />
            </svg>
            {serie.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default WeeklyStatusChart
