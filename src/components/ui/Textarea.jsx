import { useId } from 'react'
import { ERROR_CLASSES, HINT_CLASSES, INPUT_CLASSES, LABEL_CLASSES } from './fieldStyles'

/** Área de texto con etiqueta, pista y error. Mismo contrato que FormField. */
function Textarea({ label, error, hint, rows = 3, className = '', ...textareaProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={LABEL_CLASSES}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${INPUT_CLASSES} resize-y py-2 ${label ? 'mt-1' : ''}`}
        {...textareaProps}
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

export default Textarea
