import Icon from './Icon'

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-xs hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-brand-600',
  ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-brand-600',
  danger: 'bg-rose-600 text-white shadow-xs hover:bg-rose-700 focus-visible:outline-rose-600',
  'danger-outline':
    'border border-rose-300 bg-white text-rose-700 hover:bg-rose-50 focus-visible:outline-rose-600',
  link: 'text-brand-700 underline-offset-4 hover:underline focus-visible:outline-brand-600',
}

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-5 text-base gap-2',
  icon: 'h-10 w-10 p-0',
  'icon-sm': 'h-8 w-8 p-0',
}

/**
 * Botón base. Con `as={Link}` y `to` se vuelve un enlace con el mismo aspecto.
 * `loading` deshabilita y muestra un indicador; `icon` agrega un icono a la izquierda.
 */
function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  type,
  ...props
}) {
  const isDisabled = disabled || loading
  const sizeClasses = variant === 'link' ? 'h-auto gap-1 px-0 text-sm' : SIZES[size]
  const iconSize = size === 'sm' || size === 'icon-sm' ? 16 : 18

  return (
    <Component
      type={Component === 'button' ? (type ?? 'button') : undefined}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component !== 'button' && isDisabled ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      className={`inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60 ${VARIANTS[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        icon && <Icon name={icon} size={iconSize} />
      )}
      {children}
    </Component>
  )
}

export default Button
