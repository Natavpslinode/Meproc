import { useState, useEffect, useCallback } from 'react'
import { invokeEdgeFunction } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export interface AuthUser {
  id: number
  username: string
  fullName: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  sessionToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

const STORAGE_KEY = 'nata-foto-auth'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    sessionToken: null,
    isLoading: true,
    isAuthenticated: false
  })

  // Cargar estado de autenticación desde localStorage
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const { sessionToken } = JSON.parse(stored)
          
          // Verificar que la sesión siga siendo válida
          const response = await invokeEdgeFunction('admin-auth', {
            action: 'verify-session',
            sessionToken
          })
          
          if (response.data.valid) {
            setAuthState({
              user: response.data.user,
              sessionToken,
              isLoading: false,
              isAuthenticated: true
            })
          } else {
            // Sesión inválida, limpiar almacenamiento
            localStorage.removeItem(STORAGE_KEY)
            setAuthState(prev => ({ ...prev, isLoading: false }))
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Error loading auth state:', error)
        localStorage.removeItem(STORAGE_KEY)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    }

    loadAuthState()
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await invokeEdgeFunction('admin-auth', {
        action: 'login',
        username,
        password
      })
      
      if (response.data.success) {
        const authData = {
          user: response.data.user,
          sessionToken: response.data.sessionToken,
          isLoading: false,
          isAuthenticated: true
        }
        
        setAuthState(authData)
        
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          sessionToken: response.data.sessionToken
        }))
        
        toast.success(response.data.message || 'Inicio de sesión exitoso')
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Error en el inicio de sesión')
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      sessionToken: null,
      isLoading: false,
      isAuthenticated: false
    })
    
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Sesión cerrada correctamente')
  }, [])

  return {
    ...authState,
    login,
    logout
  }
}