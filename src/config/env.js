export const env = Object.freeze({
  apiBaseUrl: import.meta.env.API_BASE_URL ?? 'http://localhost:5000/api/v1',
  apiTimeout: Number(import.meta.env.API_TIMEOUT ?? 15000),
})
