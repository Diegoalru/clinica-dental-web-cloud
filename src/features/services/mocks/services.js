// DATOS DE EJEMPLO: sustituir por servicesService.list() cuando exista el endpoint.
// La forma imita la tabla services del API (camelCase) más el conteo de odontólogos habilitados.
import { ENTITY_STATUS } from '@/constants/appointmentStatus'

export const specialties = [
  { id: 1, name: 'Odontología general', description: 'Atención integral y preventiva.' },
  { id: 2, name: 'Periodoncia', description: 'Encías y tejidos de soporte.' },
  { id: 3, name: 'Ortodoncia', description: 'Alineación dental.' },
  { id: 4, name: 'Endodoncia', description: 'Tratamientos de conducto.' },
]

export const services = [
  {
    id: 1,
    name: 'Limpieza dental',
    description: 'Profilaxis y remoción de sarro.',
    durationMinutes: 45,
    price: 25000,
    status: ENTITY_STATUS.ACTIVE,
    dentistCount: 3,
  },
  {
    id: 2,
    name: 'Valoración general',
    description: 'Revisión completa y plan de tratamiento.',
    durationMinutes: 30,
    price: 15000,
    status: ENTITY_STATUS.ACTIVE,
    dentistCount: 4,
  },
  {
    id: 3,
    name: 'Resina / calza',
    description: 'Restauración con resina compuesta.',
    durationMinutes: 60,
    price: 35000,
    status: ENTITY_STATUS.ACTIVE,
    dentistCount: 2,
  },
  {
    id: 4,
    name: 'Control de ortodoncia',
    description: 'Ajuste mensual de aparatos.',
    durationMinutes: 30,
    price: 20000,
    status: ENTITY_STATUS.ACTIVE,
    dentistCount: 1,
  },
  {
    id: 6,
    name: 'Extracción simple',
    description: 'Extracción de pieza sin cirugía.',
    durationMinutes: 45,
    price: 30000,
    status: ENTITY_STATUS.ACTIVE,
    dentistCount: 2,
  },
  {
    id: 5,
    name: 'Blanqueamiento',
    description: 'Blanqueamiento en consultorio.',
    durationMinutes: 90,
    price: 120000,
    status: ENTITY_STATUS.INACTIVE,
    dentistCount: 0,
  },
]

export const findService = (id) => services.find((service) => service.id === Number(id))
