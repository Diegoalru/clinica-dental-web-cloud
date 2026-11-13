// Etiquetas de fecha para la interfaz ("Vie 13 nov", "10:15 – 11:00", "Noviembre 2026") y aritmética
// sobre fechas "AAAA-MM-DD". Todo lo que viene del API pasa por clinicTime.js para estar en hora de Costa Rica;
// la aritmética de días se hace en UTC sobre la fecha sola, que no depende de la zona del navegador.
import { getClinicParts } from './clinicTime'

export const WEEKDAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
export const WEEKDAY_LONG = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
export const WEEKDAY_LETTER = ['L', 'K', 'M', 'J', 'V', 'S', 'D']
export const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
export const MONTH_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

const pad = (number) => String(number).padStart(2, '0')
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

/** "Vie 13 nov" */
export function formatShortDate(value) {
  const { weekday, day, month } = getClinicParts(value)
  return `${WEEKDAY_SHORT[weekday - 1]} ${day} ${MONTH_SHORT[month - 1]}`
}

/** "Viernes 13 de noviembre, 2026" */
export function formatLongDate(value) {
  const { weekday, day, month, year } = getClinicParts(value)
  return `${WEEKDAY_LONG[weekday - 1]} ${day} de ${MONTH_LONG[month - 1]}, ${year}`
}

/** "02 oct 2026" */
export function formatDayMonthYear(value) {
  const { day, month, year } = getClinicParts(value)
  return `${pad(day)} ${MONTH_SHORT[month - 1]} ${year}`
}

/** "10:15" (24 horas) */
export function formatTime24(value) {
  const { hour, minute } = getClinicParts(value)
  return `${pad(hour)}:${pad(minute)}`
}

/** "10:15 – 11:00" */
export function formatTimeRange(start, end) {
  return `${formatTime24(start)} – ${formatTime24(end)}`
}

/** "Vie 13 nov · 10:15" */
export function formatDateTimeShort(value) {
  return `${formatShortDate(value)} · ${formatTime24(value)}`
}

/** "10 nov 2026 · 14:02" */
export function formatDateTimeLog(value) {
  const { day, month, year } = getClinicParts(value)
  return `${day} ${MONTH_SHORT[month - 1]} ${year} · ${formatTime24(value)}`
}

/** "Noviembre 2026" */
export function formatMonthYear(year, month) {
  return `${capitalize(MONTH_LONG[month - 1])} ${year}`
}

// ---------- Aritmética sobre "AAAA-MM-DD" ----------

export function splitIsoDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return { year, month, day }
}

export function joinIsoDate(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`
}

/** Día de la semana ISO (1 = lunes … 7 = domingo) de una fecha "AAAA-MM-DD". */
export function isoWeekday(iso) {
  const { year, month, day } = splitIsoDate(iso)
  const utcDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return utcDay === 0 ? 7 : utcDay
}

export function addDays(iso, days) {
  const { year, month, day } = splitIsoDate(iso)
  const date = new Date(Date.UTC(year, month - 1, day + days))
  return joinIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())
}

/** Lunes de la semana a la que pertenece la fecha. */
export function startOfWeek(iso) {
  return addDays(iso, 1 - isoWeekday(iso))
}

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** Etiqueta corta de una fecha sola: "Vie 13 nov". */
export function formatIsoDateShort(iso) {
  const { month, day } = splitIsoDate(iso)
  return `${WEEKDAY_SHORT[isoWeekday(iso) - 1]} ${day} ${MONTH_SHORT[month - 1]}`
}

/** Etiqueta larga de una fecha sola: "Viernes 13 de noviembre, 2026". */
export function formatIsoDateLong(iso) {
  const { year, month, day } = splitIsoDate(iso)
  return `${WEEKDAY_LONG[isoWeekday(iso) - 1]} ${day} de ${MONTH_LONG[month - 1]}, ${year}`
}

/** Suma minutos a una hora "HH:mm". */
export function addMinutes(time, minutes) {
  const [hour, minute] = time.split(':').map(Number)
  const total = hour * 60 + minute + minutes
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`
}

/** Edad en años a partir de la fecha de nacimiento "AAAA-MM-DD" y la fecha de hoy "AAAA-MM-DD". */
export function ageFromBirthDate(birthDate, today) {
  if (!birthDate) return null
  const birth = splitIsoDate(birthDate)
  const now = splitIsoDate(today)
  let age = now.year - birth.year
  if (now.month < birth.month || (now.month === birth.month && now.day < birth.day)) age -= 1
  return age
}
