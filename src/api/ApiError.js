// Error normalizado para que la UI no dependa de la forma de los errores de Axios.
export class ApiError extends Error {
  constructor(message, { status = null, data = null, cause } = {}) {
    super(message, { cause })
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }

  get isNetworkError() {
    return this.status === null
  }

  get isUnauthorized() {
    return this.status === 401
  }

  static fromAxiosError(error) {
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message ?? data?.title ?? `Error ${status} en la solicitud`
      return new ApiError(message, { status, data, cause: error })
    }

    if (error.code === 'ECONNABORTED') {
      return new ApiError('La solicitud tardó demasiado en responder', { cause: error })
    }

    return new ApiError('No se pudo conectar con el servidor', { cause: error })
  }
}
