import assert from 'node:assert/strict'
import test from 'node:test'
import { hasStarted, toAppointmentDetail, toDisplayAppointment } from './appointmentMapper.js'

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

test('el detalle agrega el contacto del paciente, la bitácora y las notificaciones', () => {
  const detail = toAppointmentDetail({
    ...response,
    patientIdentification: '9-0003-0003',
    patientPhone: '8000-0003',
    patientEmail: 'valeria@correo.com',
    logs: [{ id: 1, previousStatus: null, newStatus: 'PENDING', changedAt: '2026-11-13T10:00:00-06:00', changedBy: 'Lucía Prado', remarks: 'Cita creada' }],
    notifications: [{ id: 5, type: 'CONFIRMATION', channel: 'EMAIL', status: 'SENT', scheduledFor: '2026-11-13T10:00:00-06:00', sentAt: null }],
  })
  assert.deepEqual(detail.patient, {
    id: 3, fullName: 'Valeria Solís', identification: '9-0003-0003', phone: '8000-0003', email: 'valeria@correo.com',
  })
  assert.equal(detail.logs[0].changedBy, 'Lucía Prado')
  assert.equal(detail.notifications[0].type, 'CONFIRMATION')
  assert.equal(detail.date, '2026-11-16')
})

test('el detalle sin bitácora ni notificaciones devuelve listas vacías', () => {
  const detail = toAppointmentDetail(response)
  assert.deepEqual(detail.logs, [])
  assert.deepEqual(detail.notifications, [])
})

test('hasStarted compara instantes, sin importar el desfase con que llegue la hora', () => {
  const now = new Date('2026-11-16T14:30:00Z') // 08:30 en Costa Rica
  assert.equal(hasStarted({ startsAt: '2026-11-16T08:30:00-06:00' }, now), true)
  assert.equal(hasStarted({ startsAt: '2026-11-16T08:29:00-06:00' }, now), true)
  assert.equal(hasStarted({ startsAt: '2026-11-16T08:45:00-06:00' }, now), false)
  assert.equal(hasStarted({ startsAt: '2026-11-16T14:45:00Z' }, now), false)
})
