import { useId } from 'react'
import { ERROR_CLASSES, HINT_CLASSES, INPUT_CLASSES, INPUT_HEIGHT, LABEL_CLASSES } from './fieldStyles'

/**
 * Campo de formulario base: etiqueta, input y mensaje de error.
 * Es el punto único para estilizar todos los inputs de la aplicación (Select, Textarea y Checkbox lo imitan).
 *
 * Las props sobrantes van al <input>, así que acepta directamente lo que devuelve React Hook Form:
 *   <FormField label="Correo" type="email" error={errors.email?.message} {...field('email')} />
 */
function FormField({ label, error, hint, className = '', ...inputProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${INPUT_CLASSES} ${INPUT_HEIGHT} mt-1`}
        {...inputProps}
      />
      {hint && !error && <p className={HINT_CLASSES}>{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className={ERROR_CLASSES}>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
