import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import { AuthProvider } from '@/context/AuthProvider'
import router from '@/router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider envuelve al router para que todas las rutas y el layout puedan usar useAuth */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
