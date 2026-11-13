import { createBrowserRouter } from 'react-router'
import { routes } from './routes'

// Router de navegador (modo data router). Las rutas están en routes.jsx y las páginas por rol en lazyPages.jsx.
const router = createBrowserRouter(routes)

export default router
