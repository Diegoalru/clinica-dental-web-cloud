import { lazy, Suspense } from 'react'
import { Outlet } from 'react-router'
import LoadingState from '@/components/ui/LoadingState'

// Los módulos por rol se cargan bajo demanda para no enviar todo el código en el login.
// Este archivo solo exporta componentes (requisito de Fast Refresh); las rutas viven en routes.jsx.

export const PatientProfilePage = lazy(() => import('@/features/patients/pages/PatientProfilePage'))
export const BookAppointmentPage = lazy(() => import('@/features/appointments/pages/BookAppointmentPage'))
export const MyAppointmentsPage = lazy(() => import('@/features/appointments/pages/MyAppointmentsPage'))
export const ServicesCatalogPage = lazy(() => import('@/features/services/pages/ServicesCatalogPage'))

export const ReceptionAgendaPage = lazy(() => import('@/features/appointments/pages/ReceptionAgendaPage'))
export const NewAppointmentPage = lazy(() => import('@/features/appointments/pages/NewAppointmentPage'))
export const AppointmentDetailPage = lazy(() => import('@/features/appointments/pages/AppointmentDetailPage'))
export const PatientsPage = lazy(() => import('@/features/patients/pages/PatientsPage'))

export const DentistAgendaPage = lazy(() => import('@/features/appointments/pages/DentistAgendaPage'))
export const AttentionPage = lazy(() => import('@/features/medical-records/pages/AttentionPage'))
export const DentistPatientsPage = lazy(() => import('@/features/patients/pages/DentistPatientsPage'))
export const MySchedulePage = lazy(() => import('@/features/dentists/pages/MySchedulePage'))

export const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
export const DentistsAdminPage = lazy(() => import('@/features/dentists/pages/DentistsAdminPage'))
export const ServicesAdminPage = lazy(() => import('@/features/services/pages/ServicesAdminPage'))
export const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'))

/** Ruta padre que muestra el indicador de carga mientras llega el módulo de la página. */
export function LazyOutlet() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Outlet />
    </Suspense>
  )
}
