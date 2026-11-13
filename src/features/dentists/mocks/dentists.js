// DATOS DE EJEMPLO: sustituir por dentistsService.list() / get() cuando exista el endpoint.
// Imita dentists + users (nombre y contacto) + dentist_services + dentist_schedules + dentist_blocks.
import { ENTITY_STATUS } from '@/constants/appointmentStatus'

export const dentists = [
  {
    id: 1,
    userId: 3,
    fullName: 'Laura Mora',
    displayName: 'Dra. Laura Mora',
    email: 'laura.mora@clinica.com',
    phone: '8000-0001',
    specialtyId: 1,
    specialty: 'Odontología general',
    licenseNumber: '4521',
    status: ENTITY_STATUS.ACTIVE,
    serviceIds: [1, 2, 3, 6],
    // day_of_week ISO: 1 = lunes … 7 = domingo; un día puede tener varios tramos
    schedules: [
      { id: 1, dayOfWeek: 1, startTime: '08:00', endTime: '12:00' },
      { id: 2, dayOfWeek: 1, startTime: '13:00', endTime: '17:00' },
      { id: 3, dayOfWeek: 2, startTime: '08:00', endTime: '12:00' },
      { id: 4, dayOfWeek: 2, startTime: '13:00', endTime: '17:00' },
      { id: 5, dayOfWeek: 4, startTime: '08:00', endTime: '12:00' },
      { id: 6, dayOfWeek: 5, startTime: '08:00', endTime: '12:00' },
      { id: 7, dayOfWeek: 5, startTime: '13:00', endTime: '17:00' },
    ],
    blocks: [
      { id: 1, startsAt: '2026-11-13T12:00:00-06:00', endsAt: '2026-11-13T13:00:00-06:00', reason: 'Almuerzo extendido' },
      { id: 2, startsAt: '2026-12-21T08:00:00-06:00', endsAt: '2027-01-04T17:00:00-06:00', reason: 'Vacaciones' },
    ],
  },
  {
    id: 2,
    userId: 4,
    fullName: 'Carlos Vargas',
    displayName: 'Dr. Carlos Vargas',
    email: 'carlos.vargas@clinica.com',
    phone: '8000-0002',
    specialtyId: 2,
    specialty: 'Periodoncia',
    licenseNumber: '3310',
    status: ENTITY_STATUS.ACTIVE,
    serviceIds: [1, 2, 6],
    schedules: [
      { id: 8, dayOfWeek: 1, startTime: '13:00', endTime: '18:00' },
      { id: 9, dayOfWeek: 3, startTime: '08:00', endTime: '12:00' },
      { id: 10, dayOfWeek: 3, startTime: '13:00', endTime: '17:00' },
      { id: 11, dayOfWeek: 5, startTime: '08:00', endTime: '16:00' },
    ],
    blocks: [
      { id: 3, startsAt: '2026-11-13T08:00:00-06:00', endsAt: '2026-11-13T12:00:00-06:00', reason: 'Congreso' },
    ],
  },
  {
    id: 3,
    userId: 5,
    fullName: 'Andrés Quesada',
    displayName: 'Dr. Andrés Quesada',
    email: 'andres.quesada@clinica.com',
    phone: '8000-0003',
    specialtyId: 3,
    specialty: 'Ortodoncia',
    licenseNumber: '5102',
    status: ENTITY_STATUS.ACTIVE,
    serviceIds: [2, 4],
    schedules: [
      { id: 12, dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { id: 13, dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { id: 14, dayOfWeek: 5, startTime: '09:00', endTime: '15:00' },
    ],
    blocks: [],
  },
  {
    id: 4,
    userId: 7,
    fullName: 'Paula Chaves',
    displayName: 'Dra. Paula Chaves',
    email: 'paula.chaves@clinica.com',
    phone: '8000-0004',
    specialtyId: 4,
    specialty: 'Endodoncia',
    licenseNumber: '2875',
    status: ENTITY_STATUS.INACTIVE,
    serviceIds: [2, 3],
    schedules: [],
    blocks: [],
  },
]

export const findDentist = (id) => dentists.find((dentist) => dentist.id === Number(id))

export const activeDentists = dentists.filter((dentist) => dentist.status === ENTITY_STATUS.ACTIVE)

/** Odontólogos activos habilitados para un servicio (tabla puente dentist_services). */
export const dentistsForService = (serviceId) =>
  activeDentists.filter((dentist) => dentist.serviceIds.includes(Number(serviceId)))
