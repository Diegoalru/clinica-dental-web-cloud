// Único lugar donde se leen las variables de entorno (ver .env.example).
// El valor por defecto es el puerto del API con `dotnet run`.
export const env = Object.freeze({
  apiBaseUrl: import.meta.env.API_BASE_URL ?? 'http://localhost:5125/api/v1',
  apiTimeout: Number(import.meta.env.API_TIMEOUT ?? 15000),
})
