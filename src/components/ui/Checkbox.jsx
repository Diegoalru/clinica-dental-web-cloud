import { useId } from 'react'
import { ERROR_CLASSES } from './fieldStyles'

/**
 * Casilla con etiqueta a la derecha, texto de apoyo y error.
 * Las props sobrantes van al <input type="checkbox">, así que acepta lo que devuelve React Hook Form.
 */
function Checkbox({ label, description, error, className = '', ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-brand-600 accent-brand-600 focus:ring-2 focus:ring-brand-200"
          {...inputProps}
        />
        <span className="text-sm text-slate-700">
          {label}
          {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
        </span>
      </label>
      {error && (
        <p id={errorId} role="alert" className={ERROR_CLASSES}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Checkbox
