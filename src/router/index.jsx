import { createBrowserRouter } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import ErrorPage from '@/pages/ErrorPage'
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Landing /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
