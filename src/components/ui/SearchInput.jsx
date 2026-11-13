import Icon from './Icon'
import { INPUT_CLASSES, INPUT_HEIGHT } from './fieldStyles'

/** Campo de búsqueda con icono. Controlado: `value` y `onChange(texto)`. */
function SearchInput({ value, onChange, placeholder = 'Buscar', label = placeholder, className = '', ...props }) {
  return (
    <div className={`relative ${className}`}>
      <Icon
        name="search"
        size={18}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={`${INPUT_CLASSES} ${INPUT_HEIGHT} pl-10`}
        {...props}
      />
    </div>
  )
}

export default SearchInput
