const formatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
})

/** Precio en colones para mostrar (ej.: "₡25 000"). Acepta número o texto numérico del API. */
export function formatCurrency(value) {
  const number = typeof value === 'string' ? Number(value) : value
  if (number === null || number === undefined || Number.isNaN(number)) return '—'
  return formatter.format(number)
}

/** Duración en minutos para mostrar (ej.: "45 min", "1 h 30 min"). */
export function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return '—'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}
