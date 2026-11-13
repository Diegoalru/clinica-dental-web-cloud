// DATOS DE EJEMPLO: sustituir por patientsService.list() / get() cuando exista el endpoint.
// Imita la tabla patients; `userId` indica si el paciente tiene cuenta en el portal.
import { ENTITY_STATUS } from '@/constants/appointmentStatus'

export const patients = [
  {
    id: 1,
    userId: 10,
    fullName: 'Ana Solís Ramírez',
    identification: '1-1234-0567',
    birthDate: '1992-05-14',
    phone: '8888-0000',
    email: 'ana.solis@correo.com',
    emergencyContact: 'Marta Ramírez · 8999-1111',
    dataConsentAt: '2026-03-14T09:10:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
  {
    id: 2,
    userId: null,
    fullName: 'Pedro Jiménez Arce',
    identification: '2-0456-0789',
    birthDate: '1985-09-02',
    phone: '8777-0000',
    email: 'pedro.jimenez@correo.com',
    emergencyContact: null,
    dataConsentAt: '2026-01-20T10:00:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
  {
    id: 3,
    userId: null,
    fullName: 'Sofía Rojas León',
    identification: '1-0987-0654',
    birthDate: '2001-01-20',
    phone: '8666-0000',
    email: null,
    emergencyContact: 'Luis Rojas · 8666-0001',
    dataConsentAt: '2026-05-02T15:30:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
  {
    id: 4,
    userId: 11,
    fullName: 'Jorge Pérez Mata',
    identification: '3-0321-0111',
    birthDate: '1978-11-30',
    phone: '8555-0000',
    email: 'jorge.perez@correo.com',
    emergencyContact: null,
    dataConsentAt: '2025-11-11T11:00:00-06:00',
    status: ENTITY_STATUS.INACTIVE,
  },
  {
    id: 5,
    userId: null,
    fullName: 'Luis Castro Vega',
    identification: '1-0555-0222',
    birthDate: '1996-07-07',
    phone: '8444-0000',
    email: 'luis.castro@correo.com',
    emergencyContact: null,
    dataConsentAt: '2026-11-10T16:00:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
  {
    id: 6,
    userId: null,
    fullName: 'Marta Ugalde Solano',
    identification: '2-0777-0333',
    birthDate: '1969-02-18',
    phone: '8333-0000',
    email: 'marta.ugalde@correo.com',
    emergencyContact: 'Carlos Solano · 8333-0001',
    dataConsentAt: '2026-02-01T08:00:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
  {
    id: 7,
    userId: null,
    fullName: 'Elena Brenes Mora',
    identification: '1-0444-0888',
    birthDate: '2008-10-05',
    phone: '8222-0000',
    email: 'elena.brenes@correo.com',
    emergencyContact: 'Rosa Mora · 8222-0001',
    dataConsentAt: '2026-04-12T10:00:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
  {
    id: 8,
    userId: null,
    fullName: 'Diego Arias Campos',
    identification: '1-0999-0111',
    birthDate: '1990-12-12',
    phone: '8111-0000',
    email: 'diego.arias@correo.com',
    emergencyContact: null,
    dataConsentAt: '2026-11-11T09:00:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
  {
    id: 9,
    userId: null,
    fullName: 'Carla Méndez Rojas',
    identification: '2-0222-0444',
    birthDate: '2010-03-03',
    phone: '8000-1111',
    email: 'carla.mendez@correo.com',
    emergencyContact: 'Pablo Méndez · 8000-1112',
    dataConsentAt: '2026-06-06T10:00:00-06:00',
    status: ENTITY_STATUS.ACTIVE,
  },
]

export const findPatient = (id) => patients.find((patient) => patient.id === Number(id))

/** Búsqueda por nombre o identificación (lo que hace el buscador de recepción). */
export function searchPatients(query) {
  const text = query.trim().toLowerCase()
  if (!text) return patients
  return patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(text) || patient.identification.toLowerCase().includes(text),
  )
}
