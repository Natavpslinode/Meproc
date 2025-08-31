import React from 'react'
import { Camera, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onShowAdmin?: () => void
  isAdminView?: boolean
}

export const Header: React.FC<HeaderProps> = ({ onShowAdmin, isAdminView }) => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nata Foto
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Galería Fotográfica Personal
              </p>
            </div>
          </div>

          {/* Navegación y botones */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Bienvenido, {user?.fullName || user?.username}
                </span>
                
                {!isAdminView && (
                  <Button
                    onClick={onShowAdmin}
                    variant="outline"
                    size="sm"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Panel Admin
                  </Button>
                )}
                
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}