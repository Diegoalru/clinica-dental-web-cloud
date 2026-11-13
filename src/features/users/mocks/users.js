// DATOS DE EJEMPLO: sustituir por usersService.list() cuando exista el endpoint. Imita la tabla users.
import { ENTITY_STATUS } from '@/constants/appointmentStatus'
import { ROLES } from '@/constants/roles'

export const users = [
  { id: 1, fullName: 'Roberto Núñez', email: 'roberto.nunez@clinica.com', phone: '8000-0000', role: ROLES.ADMIN, status: ENTITY_STATUS.ACTIVE },
  { id: 2, fullName: 'María Fallas', email: 'maria.fallas@clinica.com', phone: '8000-0010', role: ROLES.RECEPTIONIST, status: ENTITY_STATUS.ACTIVE },
  { id: 3, fullName: 'Laura Mora', email: 'laura.mora@clinica.com', phone: '8000-0001', role: ROLES.DENTIST, status: ENTITY_STATUS.ACTIVE },
  { id: 4, fullName: 'Carlos Vargas', email: 'carlos.vargas@clinica.com', phone: '8000-0002', role: ROLES.DENTIST, status: ENTITY_STATUS.ACTIVE },
  { id: 5, fullName: 'Andrés Quesada', email: 'andres.quesada@clinica.com', phone: '8000-0003', role: ROLES.DENTIST, status: ENTITY_STATUS.ACTIVE },
  { id: 10, fullName: 'Ana Solís Ramírez', email: 'ana.solis@correo.com', phone: '8888-0000', role: ROLES.PATIENT, status: ENTITY_STATUS.ACTIVE },
  { id: 7, fullName: 'Paula Chaves', email: 'paula.chaves@clinica.com', phone: '8000-0004', role: ROLES.DENTIST, status: ENTITY_STATUS.INACTIVE },
  { id: 11, fullName: 'Jorge Pérez Mata', email: 'jorge.perez@correo.com', phone: '8555-0000', role: ROLES.PATIENT, status: ENTITY_STATUS.INACTIVE },
]
