import { ApiError } from '@/api'

/**
 * Pasa un error del API a un formulario de React Hook Form.
 *
 * - Los errores por campo (400 de validación) se asignan a cada campo con setError.
 * - Devuelve el mensaje general para mostrarlo arriba del formulario, o null si todo quedó en los campos.
 *
 * @param {unknown} error Lo que se atrapó en el catch.
 * @param {import('react-hook-form').UseFormSetError<any>} setError
 * @param {string[]} fields Campos que existen en el formulario.
 * @returns {string | null}
 */
export function applyApiErrors(error, setError, fields) {
  if (!(error instanceof ApiError)) {
    return 'Ocurrió un error inesperado. Intente de nuevo.'
  }

  let assigned = 0
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    if (fields.includes(field)) {
      setError(field, { type: 'server', message })
      assigned += 1
    }
  }

  // Si todos los errores quedaron junto a su campo, no hace falta un mensaje general
  const allAssigned = assigned > 0 && assigned === Object.keys(error.fieldErrors).length
  return allAssigned ? null : error.message
}
