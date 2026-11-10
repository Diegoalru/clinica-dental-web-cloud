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

// Adjunta el JWT a cada solicitud cuando existe.
httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Convierte cualquier fallo en un ApiError y limpia la sesión si el token expiró.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = ApiError.fromAxiosError(error)
    if (apiError.isUnauthorized) {
      tokenStorage.clear()
    }
    return Promise.reject(apiError)
  },
)
