import { useCallback, useEffect, useMemo, useState } from 'react'
import { setSessionExpiredHandler } from '@/api'
import { authService } from '@/features/auth/services/authService'
import { tokenStorage } from '@/utils/tokenStorage'
import { AuthContext } from './AuthContext'

/**
 * Mantiene la sesión de la aplicación.
 *
 * - Lo único que se guarda en el navegador es el token (tokenStorage).
 * - El usuario vive en memoria y se vuelve a pedir al API (GET /auth/me) cada vez que se carga la página,
 *   así el rol que se muestra siempre es el que el API reconoce.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Mientras se comprueba el token guardado no se sabe si hay sesión; las rutas protegidas esperan
  const [isLoading, setIsLoading] = useState(() => Boolean(tokenStorage.get()))

  // Al cargar la página: si hay token guardado, se recupera el usuario
  useEffect(() => {
    if (!tokenStorage.get()) return

    const controller = new AbortController()

    authService
      .me({ signal: controller.signal })
      .then(setUser)
      .catch(() => {
        // Si el token ya no sirve, el interceptor de httpClient ya lo borró.
        // Si el API no respondió, el token se conserva y se reintenta en la próxima carga.
        setUser(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  // Si el API rechaza el token en cualquier solicitud posterior, se cierra la sesión en la interfaz
  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null))
    return () => setSessionExpiredHandler(null)
  }, [])

  const startSession = useCallback((response) => {
    tokenStorage.set(response.accessToken)
    setUser(response.user)
    return response.user
  }, [])

  // Las tres funciones dejan pasar el ApiError: el formulario decide cómo mostrarlo
  const login = useCallback(
    async (credentials) => startSession(await authService.login(credentials)),
    [startSession],
  )

  const register = useCallback(
    async (form) => startSession(await authService.register(form)),
    [startSession],
  )

  // El API no guarda sesiones (JWT sin estado): cerrar sesión es olvidar el token
  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  const hasRole = useCallback((...roles) => user !== null && roles.includes(user.role), [user])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
      hasRole,
    }),
    [user, isLoading, login, register, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
