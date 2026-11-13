// Pruebas de clinicTime.js con el runner nativo de Node: npm test
// Deben dar lo mismo en cualquier zona horaria. Probar también con: TZ=Asia/Tokyo npm test
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  formatClinicDate,
  formatClinicDateTime,
  formatClinicTime,
  getClinicParts,
  parseClinicDate,
  toApiDateTime,
  toClinicIsoDate,
  toClinicTimeInput,
  todayInClinic,
} from './clinicTime.js'

// Intl separa "a. m." con espacios especiales (U+00A0 y U+202F); se normalizan para comparar
const normalize = (text) => text.replace(/[\u00a0\u202f]/g, ' ')

// 9:00 a. m. del viernes 20/11/2026 en Costa Rica, escrito de las formas en que puede llegar
const NINE_AM = ['2026-11-20T09:00:00-06:00', '2026-11-20T15:00:00Z', '2026-11-20T15:00:00.000Z', '2026-11-20T09:00:00']

describe('parseClinicDate', () => {
  it('interpreta todos los formatos como el mismo instante', () => {
    for (const value of NINE_AM) {
      assert.equal(parseClinicDate(value).toISOString(), '2026-11-20T15:00:00.000Z', value)
    }
  })

  it('toma una fecha sola como el inicio del día en Costa Rica, no medianoche UTC', () => {
    assert.equal(parseClinicDate('2026-11-20').toISOString(), '2026-11-20T06:00:00.000Z')
    assert.equal(toClinicIsoDate('2026-11-20'), '2026-11-20')
  })

  it('acepta fracciones de segundo como las que manda el API', () => {
    assert.equal(parseClinicDate('2026-11-13T10:22:33.123456-06:00').toISOString(), '2026-11-13T16:22:33.123Z')
  })

  it('rechaza una fecha inválida', () => {
    assert.throws(() => parseClinicDate('no es fecha'), RangeError)
  })
})

describe('getClinicParts', () => {
  it('da la hora de Costa Rica', () => {
    for (const value of NINE_AM) {
      assert.deepEqual(getClinicParts(value), {
        year: 2026, month: 11, day: 20, hour: 9, minute: 0, second: 0, weekday: 5,
      })
    }
  })

  it('una cita de noche en Costa Rica conserva su día aunque en UTC ya sea el siguiente', () => {
    const parts = getClinicParts('2026-11-21T02:30:00Z')
    assert.equal(parts.day, 20)
    assert.equal(parts.hour, 20)
    assert.equal(parts.minute, 30)
  })

  it('el domingo es 7, como en los horarios del API', () => {
    // Domingo 22/11/2026 19:00 en Costa Rica = lunes 01:00 UTC
    assert.equal(getClinicParts('2026-11-23T01:00:00Z').weekday, 7)
  })

  it('medianoche se escribe 0, no 24', () => {
    assert.equal(getClinicParts('2026-11-20T00:00:00-06:00').hour, 0)
  })
})

describe('todayInClinic', () => {
  it('cerca de medianoche usa el día de Costa Rica', () => {
    // 05:30 UTC del 21 = 23:30 del 20 en Costa Rica
    assert.equal(todayInClinic(new Date('2026-11-21T05:30:00Z')), '2026-11-20')
    // 06:00 UTC del 21 = medianoche del 21 en Costa Rica
    assert.equal(todayInClinic(new Date('2026-11-21T06:00:00Z')), '2026-11-21')
  })

  it('sin argumento devuelve una fecha AAAA-MM-DD', () => {
    assert.match(todayInClinic(), /^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('campos de formulario', () => {
  it('toApiDateTime arma la fecha sin zona que el API toma como hora de Costa Rica', () => {
    assert.equal(toApiDateTime('2026-11-20', '09:00'), '2026-11-20T09:00:00')
    assert.equal(parseClinicDate(toApiDateTime('2026-11-20', '09:00')).toISOString(), '2026-11-20T15:00:00.000Z')
  })

  it('toApiDateTime rechaza formatos inválidos', () => {
    assert.throws(() => toApiDateTime('20/11/2026', '09:00'), RangeError)
    assert.throws(() => toApiDateTime('2026-11-20', '9:00'), RangeError)
  })

  it('ida y vuelta: lo que responde el API se puede cargar en el formulario y reenviar igual', () => {
    const fromApi = '2026-11-20T16:45:00-06:00'
    const sent = toApiDateTime(toClinicIsoDate(fromApi), toClinicTimeInput(fromApi))
    assert.equal(sent, '2026-11-20T16:45:00')
  })
})

describe('formato para mostrar', () => {
  it('muestra la fecha y la hora de Costa Rica', () => {
    for (const value of NINE_AM) {
      const text = normalize(formatClinicDateTime(value))
      assert.match(text, /20/, text)
      assert.match(text, /2026/, text)
      assert.match(text, /\b9:00\b/, text)
      assert.match(text, /a\.\s?m\./, text)
    }
  })

  it('una cita nocturna se muestra con su día y hora de Costa Rica', () => {
    const value = '2026-11-21T02:30:00Z'
    assert.match(normalize(formatClinicDate(value)), /20/)
    assert.match(normalize(formatClinicTime(value)), /8:30\s?p\.\s?m\./)
  })
})
