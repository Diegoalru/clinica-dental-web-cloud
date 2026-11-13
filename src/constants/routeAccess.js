// Qué roles pueden abrir cada área de la aplicación. Única fuente: la usan el router (prop `roles` de
// ProtectedRoute) y GuestRoute (para decidir si el destino recordado sirve para quien acaba de entrar).
// Las extensiones .js en los imports permiten probar este archivo con `node --test`.
import { ROLES, STAFF_ROLES } from './roles.js'
import { ROUTES } from './routes.js'

export const AREA_ROLES = Object.freeze({
  PATIENT: Object.freeze([ROLES.PATIENT]),
  RECEPTION: STAFF_ROLES,
  DENTIST: Object.freeze([ROLES.DENTIST]),
  ADMIN: Object.freeze([ROLES.ADMIN]),
})

// Prefijo de ruta → roles. Lo que no aparece aquí (/inicio, /perfil) lo abre cualquier usuario con sesión.
const ACCESS_BY_PREFIX = Object.freeze([
  { prefix: '/citas', roles: AREA_ROLES.PATIENT },
  { prefix: '/servicios', roles: AREA_ROLES.PATIENT },
  { prefix: '/recepcion', roles: AREA_ROLES.RECEPTION },
  { prefix: '/odontologo', roles: AREA_ROLES.DENTIST },
  { prefix: '/admin', roles: AREA_ROLES.ADMIN },
])

// Páginas que no tienen sentido como destino después de iniciar sesión
const NEVER_A_DESTINATION = [ROUTES.FORBIDDEN, ROUTES.LOGIN, ROUTES.REGISTER]

/**
 * ¿Puede este rol abrir la ruta? Acepta la ruta con query ("/citas?x=1").
 *
 * @param {string} path
 * @param {string} role
 */
export function canRoleAccess(path, role) {
  const pathname = path.split(/[?#]/)[0]
  const area = ACCESS_BY_PREFIX.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  return area ? area.roles.includes(role) : true
}

/**
 * A dónde enviar a un usuario que acaba de iniciar sesión: al destino recordado si su rol puede abrirlo,
 * o al inicio. Evita que caiga en "Acceso denegado" por un destino que guardó otro usuario u otra página.
 *
 * @param {string | undefined} from Destino recordado (location.state.from)
 * @param {string} role
 */
export function resolvePostLoginDestination(from, role) {
  if (typeof from !== 'string' || !from.startsWith('/')) return ROUTES.DASHBOARD
  const pathname = from.split(/[?#]/)[0]
  if (NEVER_A_DESTINATION.includes(pathname)) return ROUTES.DASHBOARD
  return canRoleAccess(from, role) ? from : ROUTES.DASHBOARD
}
