const TOKEN_KEY = 'access_token'

// Acceso centralizado al JWT para poder cambiar el mecanismo de almacenamiento
// sin tocar el resto de la aplicación.
export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // Almacenamiento no disponible (modo privado, permisos)
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // Almacenamiento no disponible
    }
  },
}
