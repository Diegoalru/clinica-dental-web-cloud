/** Ancho y márgenes comunes de las páginas con sesión. `narrow` para formularios y detalles. */
function PageContainer({ narrow = false, className = '', children }) {
  return (
    <div
      className={`mx-auto w-full ${narrow ? 'max-w-4xl' : 'max-w-7xl'} space-y-6 px-4 py-6 sm:px-6 sm:py-8 ${className}`}
    >
      {children}
    </div>
  )
}

export default PageContainer
