import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

/**
 * Sesión actual.
 *
 * @returns {{
 *   user: { id: number, fullName: string, email: string, role: string, patientId: number|null, dentistId: number|null } | null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   login: (credentials: { email: string, password: string }) => Promise<object>,
 *   register: (form: object) => Promise<object>,
 *   logout: () => void,
 *   hasRole: (...roles: string[]) => boolean,
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return context
}
