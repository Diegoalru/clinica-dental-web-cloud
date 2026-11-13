// Error normalizado para que la UI no dependa de la forma de los errores de Axios.
//
// El API responde los errores como ProblemDetails:
//   { "title": "El correo ya está registrado.", "status": 409 }
// y los 400 de validación agregan el detalle por campo:
//   { "title": "Hay datos inválidos en la solicitud.", "status": 400,
//     "errors": { "Email": ["El correo no es válido."] } }
export class ApiError extends Error {
  constructor(message, { status = null, data = null, fieldErrors = {}, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.status = status
    this.data = data
    // { nombreDelCampo: 'primer mensaje' }, con el nombre como lo usa el formulario (camelCase)
    this.fieldErrors = fieldErrors
  }

  get isNetworkError() {
    return this.status === null
  }

  get isValidation() {
    return this.status === 400
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isForbidden() {
    return this.status === 403
  }

  get isConflict() {
    return this.status === 409
  }

  get hasFieldErrors() {
    return Object.keys(this.fieldErrors).length > 0
  }

  static fromAxiosError(error) {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message ?? data?.title ?? `Error ${status} en la solicitud`
      return new ApiError(message, {
        status,
        data,
        fieldErrors: parseFieldErrors(data?.errors),
        cause: error,
      })
    }

    if (error.code === 'ECONNABORTED') {
      return new ApiError('La solicitud tardó demasiado en responder', { cause: error })
    }

    return new ApiError('No se pudo conectar con el servidor', { cause: error })
  }
}

// Convierte { "Email": ["msg1", "msg2"] } en { email: "msg1" }.
// El API nombra los campos como las propiedades de C# ("FullName"); el formulario usa camelCase ("fullName").
// Cuando el JSON no se pudo leer, la clave llega como "$.birthDate": se le quita el "$.".
function parseFieldErrors(errors) {
  if (!errors || typeof errors !== 'object') return {}

  const result = {}
  for (const [key, messages] of Object.entries(errors)) {
    const name = key.replace(/^\$\.?/, '')
    if (!name) continue
    const field = name.charAt(0).toLowerCase() + name.slice(1)
    result[field] = Array.isArray(messages) ? messages[0] : String(messages)
  }
  return result
}
