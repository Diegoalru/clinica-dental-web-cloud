import assert from 'node:assert/strict'
import test from 'node:test'
import { toDisplayAppointment } from './appointmentMapper.js'

const response = {
  id: 30,
  patientId: 3,
  patientName: 'Valeria Solís',
  dentistId: 2,
  dentistName: 'Dr. Luis Rojas',
  serviceId: 1,
  serviceName: 'Valoración inicial',
  startsAt: '2026-11-16T08:30:00-06:00',
  endsAt: '2026-11-16T09:00:00-06:00',
  status: 'PENDING',
}

test('adapta una cita real del API para la agenda y el paciente', () => {
  const appointment = toDisplayAppointment(response)
  assert.equal(appointment.date, '2026-11-16')
  assert.deepEqual(appointment.patient, { id: 3, fullName: 'Valeria Solís' })
  assert.deepEqual(appointment.dentist, { id: 2, displayName: 'Dr. Luis Rojas' })
  assert.equal(appointment.service.durationMinutes, 30)
  assert.equal(appointment.status, 'PENDING')
})

test('conserva el día de Costa Rica cuando el API responde en UTC', () => {
  const appointment = toDisplayAppointment({
    ...response,
    startsAt: '2026-11-17T02:30:00Z',
    endsAt: '2026-11-17T03:00:00Z',
  })
  assert.equal(appointment.date, '2026-11-16')
  assert.equal(appointment.service.durationMinutes, 30)
})
