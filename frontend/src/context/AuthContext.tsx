import { createContext, useContext, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LoginResponse } from '../types/auth.types'

interface AuthUser {
  id: number
  userName: string
  email: string
  roles: string[]
  // Avatar opcional para mostrar en navbar
  avatarUrl?: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  // Verifica si el usuario tiene un rol específico
  hasRole: (role: 'Host' | 'Guest') => boolean
  login: (loginResponse: LoginResponse) => void
  logout: () => void
  updateUser: (updates: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  // Lee el estado inicial desde localStorage
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('neststay_token')
  )
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('neststay_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (loginResponse: LoginResponse) => {
    // Construye el objeto de usuario desde la respuesta del login
    const authUser: AuthUser = {
      id: 0,
      userName: loginResponse.userName,
      email: loginResponse.email || '',
      roles: loginResponse.roles,
      avatarUrl: loginResponse.avatarUrl
    }
    localStorage.setItem('neststay_token', loginResponse.token)
    localStorage.setItem('neststay_user', JSON.stringify(authUser))
    setToken(loginResponse.token)
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem('neststay_token')
    localStorage.removeItem('neststay_user')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    localStorage.setItem('neststay_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const hasRole = (role: 'Host' | 'Guest'): boolean => {
    return user?.roles.includes(role) ?? false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        hasRole,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
