// Único lugar donde se leen las variables de entorno. Los valores no viven en el código:
// salen del archivo .env en local (ver .env.example) y de la configuración del pipeline en el despliegue.
function required(name) {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Copie .env.example a .env y defina su valor.`)
  }
  return value
}

export const env = Object.freeze({
  apiBaseUrl: required('API_BASE_URL'),
  apiTimeout: Number(required('API_TIMEOUT')),
})
