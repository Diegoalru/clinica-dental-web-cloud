import { useId } from 'react'
import Icon from './Icon'
import { ERROR_CLASSES, HINT_CLASSES, INPUT_CLASSES, INPUT_HEIGHT, LABEL_CLASSES } from './fieldStyles'

/**
 * Campo <select> con etiqueta, pista y error. Mismo contrato que FormField:
 * las props sobrantes van al <select>, así que acepta lo que devuelve React Hook Form.
 * Las opciones van como children (<option>) o con la prop `options` [{ value, label }].
 */
function Select({ label, error, hint, options, placeholder, className = '', children, ...selectProps }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={LABEL_CLASSES}>
          {label}
        </label>
      )}
      <div className={`relative ${label ? 'mt-1' : ''}`}>
        <select
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${INPUT_CLASSES} ${INPUT_HEIGHT} appearance-none pr-10`}
          {...selectProps}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <Icon
          name="chevron-down"
          size={18}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
        />
      </div>
      {hint && !error && <p className={HINT_CLASSES}>{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className={ERROR_CLASSES}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
