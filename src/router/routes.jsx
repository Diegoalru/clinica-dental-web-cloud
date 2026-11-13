import GuestRoute from '@/components/common/GuestRoute'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { AREA_ROLES } from '@/constants/routeAccess'
import { ROUTES } from '@/constants/routes'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import Dashboard from '@/pages/Dashboard'
import ErrorPage from '@/pages/ErrorPage'
import Forbidden from '@/pages/Forbidden'
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'
import {
  AppointmentDetailPage,
  AttentionPage,
  BookAppointmentPage,
  DentistAgendaPage,
  DentistPatientsPage,
  DentistsAdminPage,
  LazyOutlet,
  MyAppointmentsPage,
  MySchedulePage,
  NewAppointmentPage,
  PatientProfilePage,
  PatientsPage,
  ReceptionAgendaPage,
  ReportsPage,
  ServicesAdminPage,
  ServicesCatalogPage,
  UsersPage,
} from './lazyPages'

// Definición de rutas (sin el router), para poder crear un router de navegador o uno estático en pruebas.
export const routes = [
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Públicas
      { index: true, element: <Landing /> },

      // Solo sin sesión: con sesión redirigen al inicio
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.LOGIN, element: <LoginPage /> },
              { path: ROUTES.REGISTER, element: <RegisterPage /> },
            ],
          },
        ],
      },

      // Cualquier usuario con sesión
      {
        element: <ProtectedRoute />,
        children: [
          { path: ROUTES.DASHBOARD, element: <Dashboard /> },
          { path: ROUTES.FORBIDDEN, element: <Forbidden /> },
          {
            element: <LazyOutlet />,
            children: [{ path: ROUTES.PROFILE, element: <PatientProfilePage /> }],
          },
        ],
      },

      // Paciente
      {
        element: <ProtectedRoute roles={AREA_ROLES.PATIENT} />,
        children: [
          {
            element: <LazyOutlet />,
            children: [
              { path: ROUTES.PATIENT_BOOK, element: <BookAppointmentPage /> },
              { path: ROUTES.PATIENT_APPOINTMENTS, element: <MyAppointmentsPage /> },
              { path: ROUTES.SERVICES, element: <ServicesCatalogPage /> },
            ],
          },
        ],
      },

      // Recepción (y administrador)
      {
        element: <ProtectedRoute roles={AREA_ROLES.RECEPTION} />,
        children: [
          {
            element: <LazyOutlet />,
            children: [
              { path: ROUTES.RECEPTION_AGENDA, element: <ReceptionAgendaPage /> },
              { path: ROUTES.RECEPTION_NEW_APPOINTMENT, element: <NewAppointmentPage /> },
              { path: ROUTES.RECEPTION_APPOINTMENT_PATTERN, element: <AppointmentDetailPage /> },
              { path: ROUTES.RECEPTION_PATIENTS, element: <PatientsPage /> },
            ],
          },
        ],
      },

      // Odontólogo
      {
        element: <ProtectedRoute roles={AREA_ROLES.DENTIST} />,
        children: [
          {
            element: <LazyOutlet />,
            children: [
              { path: ROUTES.DENTIST_AGENDA, element: <DentistAgendaPage /> },
              { path: ROUTES.DENTIST_ATTENTION_PATTERN, element: <AttentionPage /> },
              { path: ROUTES.DENTIST_PATIENTS, element: <DentistPatientsPage /> },
              { path: ROUTES.DENTIST_SCHEDULE, element: <MySchedulePage /> },
            ],
          },
        ],
      },

      // Administrador
      {
        element: <ProtectedRoute roles={AREA_ROLES.ADMIN} />,
        children: [
          {
            element: <LazyOutlet />,
            children: [
              { path: ROUTES.ADMIN_REPORTS, element: <ReportsPage /> },
              { path: ROUTES.ADMIN_DENTISTS, element: <DentistsAdminPage /> },
              { path: ROUTES.ADMIN_SERVICES, element: <ServicesAdminPage /> },
              { path: ROUTES.ADMIN_USERS, element: <UsersPage /> },
            ],
          },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]
