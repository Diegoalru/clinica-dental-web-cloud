/** Indicador de carga a pantalla completa de sección. Lo usan los guards de ruta y Suspense. */
function LoadingState({ label = 'Cargando…', className = '' }) {
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-3 px-4 py-20 text-slate-500 ${className}`}>
      <span
        className="size-8 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600"
        aria-hidden="true"
      />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export default LoadingState
