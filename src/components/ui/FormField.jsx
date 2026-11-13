import { useId } from 'react'

/**
 * Campo de formulario básico: etiqueta, input y mensaje de error.
 * Estilo mínimo a propósito; el diseño final se aplica aquí y llega a todos los formularios.
 *
 * Las props sobrantes van al <input>, así que acepta directamente lo que devuelve React Hook Form:
 *   <FormField label="Correo" type="email" error={errors.email?.message} {...field('email')} />
 */
function FormField({ label, error, hint, ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 aria-invalid:border-red-500"
        {...inputProps}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
