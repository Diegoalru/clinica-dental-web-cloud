import { ApiService } from '@/api'

const authApi = new ApiService('/auth')

// Llamadas al API de autenticación. No guardan nada: de la sesión se encarga AuthProvider.
//
// login y register responden { accessToken, expiresAt, user }
// user = { id, fullName, email, role, patientId, dentistId }
export const authService = {
  /** POST /auth/login. Responde 401 si el correo o la contraseña no coinciden. */
  login({ email, password }) {
    return authApi.post('/login', { email: email.trim(), password })
  },

  /**
   * POST /auth/register. Crea la cuenta de un paciente y devuelve la sesión iniciada.
   * Responde 400 (validación por campo) o 409 (correo o identificación ya registrados).
   */
  register(form) {
    return authApi.post('/register', {
      fullName: form.fullName.trim(),
      identification: form.identification.trim(),
      email: form.email.trim(),
      password: form.password,
      // Los opcionales vacíos se envían como null: un "" en birthDate no es una fecha válida para el API
      phone: emptyToNull(form.phone),
      birthDate: emptyToNull(form.birthDate),
      emergencyContact: emptyToNull(form.emergencyContact),
      acceptsDataConsent: form.acceptsDataConsent === true,
    })
  },

  /** GET /auth/me. Devuelve el usuario del token guardado; 401 si ya no es válido. */
  me(config) {
    return authApi.get('/me', config)
  },
}

function emptyToNull(value) {
  const text = typeof value === 'string' ? value.trim() : value
  return text ? text : null
}
