import { createContext } from 'react'

// El valor lo arma AuthProvider; los componentes lo leen con el hook useAuth.
export const AuthContext = createContext(null)
