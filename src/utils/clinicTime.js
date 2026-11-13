// Fechas y horas de la clínica. Todo se muestra en hora de Costa Rica, aunque el navegador esté en otra zona.
//
// Contrato con el API:
// - El API responde las fechas con el desfase de Costa Rica: "2026-11-20T09:00:00-06:00".
// - Al enviar, una fecha sin zona ("2026-11-20T09:00:00") el API la toma como hora de Costa Rica.
//
// No usar new Date("2026-11-20") ni getHours()/getDate() para mostrar fechas del API: dependen de la zona del
// navegador. Usar las funciones de este archivo.

export const CLINIC_TIME_ZONE = 'America/Costa_Rica'

// Costa Rica no tiene horario de verano: el desfase es siempre -06:00
const CLINIC_OFFSET = '-06:00'
const LOCALE = 'es-CR'

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i
const TIME = /^\d{2}:\d{2}$/

/**
 * Convierte lo que llega del API (o un Date) en un Date.
 * Un texto sin zona se toma como hora de Costa Rica; una fecha sola ("2026-11-20"), como el inicio de ese día
 * en Costa Rica (new Date la tomaría como medianoche UTC, que en Costa Rica todavía es el día anterior).
 *
 * @param {string | number | Date} value
 * @returns {Date}
 */
export function parseClinicDate(value) {
  let date
  if (value instanceof Date) {
    date = new Date(value.getTime())
  } else if (typeof value === 'string' && DATE_ONLY.test(value)) {
    date = new Date(`${value}T00:00:00${CLINIC_OFFSET}`)
  } else if (typeof value === 'string' && !HAS_ZONE.test(value)) {
    date = new Date(`${value}${CLINIC_OFFSET}`)
  } else {
    date = new Date(value)
  }

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Fecha inválida: ${value}`)
  }
  return date
}

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: CLINIC_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  weekday: 'short',
})

const WEEKDAYS = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

/**
 * Componentes de la fecha en hora de Costa Rica. Sirve para agrupar o comparar (por ejemplo, citas por día).
 * weekday sigue la norma ISO, igual que los horarios del API: 1 = lunes ... 7 = domingo.
 *
 * @param {string | number | Date} value
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number, second: number, weekday: number }}
 */
export function getClinicParts(value) {
  const parts = {}
  for (const { type, value: part } of partsFormatter.formatToParts(parseClinicDate(value))) {
    parts[type] = part
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: WEEKDAYS[parts.weekday],
  }
}

const pad = (number) => String(number).padStart(2, '0')

/**
 * Fecha en Costa Rica como "AAAA-MM-DD" (el formato de <input type="date">).
 *
 * @param {string | number | Date} value
 */
export function toClinicIsoDate(value) {
  const { year, month, day } = getClinicParts(value)
  return `${year}-${pad(month)}-${pad(day)}`
}

/**
 * Hora en Costa Rica como "HH:mm" (el formato de <input type="time">).
 *
 * @param {string | number | Date} value
 */
export function toClinicTimeInput(value) {
  const { hour, minute } = getClinicParts(value)
  return `${pad(hour)}:${pad(minute)}`
}

/**
 * La fecha de hoy en Costa Rica, "AAAA-MM-DD". Recibe "ahora" para poder probarla.
 *
 * @param {Date} [now]
 */
export function todayInClinic(now = new Date()) {
  return toClinicIsoDate(now)
}

/**
 * Arma la fecha y hora que se envía al API a partir de los campos del formulario.
 * Va sin zona, así que el API la toma como hora de Costa Rica.
 *
 * @param {string} date "AAAA-MM-DD"
 * @param {string} time "HH:mm"
 * @returns {string} "AAAA-MM-DDTHH:mm:00"
 */
export function toApiDateTime(date, time) {
  if (!DATE_ONLY.test(date) || !TIME.test(time)) {
    throw new RangeError(`Fecha u hora inválida: ${date} ${time}`)
  }
  return `${date}T${time}:00`
}

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: CLINIC_TIME_ZONE,
  dateStyle: 'medium',
  timeStyle: 'short',
})
const dateFormatter = new Intl.DateTimeFormat(LOCALE, { timeZone: CLINIC_TIME_ZONE, dateStyle: 'medium' })
const timeFormatter = new Intl.DateTimeFormat(LOCALE, { timeZone: CLINIC_TIME_ZONE, timeStyle: 'short' })

/** Fecha y hora para mostrar, en hora de Costa Rica (ej.: "20 nov 2026, 9:00 a. m."). */
export function formatClinicDateTime(value) {
  return dateTimeFormatter.format(parseClinicDate(value))
}

/** Solo la fecha para mostrar, en hora de Costa Rica. */
export function formatClinicDate(value) {
  return dateFormatter.format(parseClinicDate(value))
}

/** Solo la hora para mostrar, en hora de Costa Rica. */
export function formatClinicTime(value) {
  return timeFormatter.format(parseClinicDate(value))
}
