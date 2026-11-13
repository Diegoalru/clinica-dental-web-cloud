import axios from 'axios'
import { env } from '@/config/env'
import { tokenStorage } from '@/utils/tokenStorage'
import { ApiError } from './ApiError'

// Instancia única de Axios con la configuración común de la API.
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Función que se llama cuando el API rechaza un token (expiró o el usuario fue desactivado).
// La registra AuthProvider para cerrar la sesión en la interfaz.
let onSessionExpired = null

export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler
}

// Adjunta el JWT a cada solicitud cuando existe.
httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Convierte cualquier fallo en un ApiError y limpia la sesión si el token ya no sirve.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = ApiError.fromAxiosError(error)

    // Un 401 solo significa "sesión vencida" si la solicitud llevaba token.
    // El 401 del login (credenciales inválidas) no lleva token y no debe cerrar nada.
    const sentToken = Boolean(error.config?.headers?.Authorization)
    if (apiError.isUnauthorized && sentToken) {
      tokenStorage.clear()
      onSessionExpired?.()
    }

    return Promise.reject(apiError)
  },
)
