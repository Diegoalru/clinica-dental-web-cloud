import { httpClient } from './httpClient'

/**
 * Servicio genérico para un recurso REST de la API.
 *
 * @example
 * const patientsApi = new ApiService('/patients')
 * const list = await patientsApi.get('', { params: { page: 1 } })
 * const one = await patientsApi.get('/42')
 * const created = await patientsApi.post('', { name: 'Ana' })
 */
export class ApiService {
  /**
   * @param {string} resource Ruta del recurso relativa a la URL base, p. ej. '/patients'.
   * @param {import('axios').AxiosInstance} [client] Cliente HTTP; inyectable para pruebas.
   */
  constructor(resource, client = httpClient) {
    this.resource = resource.replace(/\/+$/, '')
    this.client = client
  }

  /** @param {string} [path] Sufijo opcional, p. ej. '/42' o '/42/appointments'. */
  buildUrl(path = '') {
    if (!path) return this.resource
    return `${this.resource}${path.startsWith('/') ? path : `/${path}`}`
  }

  /**
   * @param {string} [path]
   * @param {import('axios').AxiosRequestConfig} [config] Query params, signal, headers…
   * @returns {Promise<any>} El cuerpo de la respuesta.
   */
  async get(path = '', config = {}) {
    const { data } = await this.client.get(this.buildUrl(path), config)
    return data
  }

  /**
   * @param {string} [path]
   * @param {unknown} [body]
   * @param {import('axios').AxiosRequestConfig} [config]
   * @returns {Promise<any>} El cuerpo de la respuesta.
   */
  async post(path = '', body, config = {}) {
    const { data } = await this.client.post(this.buildUrl(path), body, config)
    return data
  }

  /** Reemplaza un recurso completo. Mismos parámetros que post. */
  async put(path = '', body, config = {}) {
    const { data } = await this.client.put(this.buildUrl(path), body, config)
    return data
  }

  /** Actualiza parte de un recurso (por ejemplo, el estado). Mismos parámetros que post. */
  async patch(path = '', body, config = {}) {
    const { data } = await this.client.patch(this.buildUrl(path), body, config)
    return data
  }

  /** Mismos parámetros que get. */
  async delete(path = '', config = {}) {
    const { data } = await this.client.delete(this.buildUrl(path), config)
    return data
  }
}
