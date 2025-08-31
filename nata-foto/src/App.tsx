import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { PhotoGallery } from '@/components/gallery/PhotoGallery'
import { LoginForm } from '@/components/auth/LoginForm'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { UploadForm } from '@/components/upload/UploadForm'
import { useAuth } from '@/hooks/useAuth'
import { usePhotos } from '@/hooks/usePhotos'
import { Camera, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  const { fetchPublicPhotos } = usePhotos()
  const [currentView, setCurrentView] = useState<'gallery' | 'admin'>('gallery')
  const [showUploadForm, setShowUploadForm] = useState(false)

  const handleUploadSuccess = () => {
    setShowUploadForm(false)
    fetchPublicPhotos()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando Nata Foto...</p>
        </div>
      </div>
    )
  }

  // Login screen for non-authenticated users wanting to access admin
  if (!isAuthenticated && currentView === 'admin') {
    return (
      <>
        <LoginForm />
        <Toaster position="top-right" />
      </>
    )
  }

  // Admin panel
  if (isAuthenticated && currentView === 'admin') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <Header 
            isAdminView
          />
          <AdminPanel onBack={() => setCurrentView('gallery')} />
        </div>
        <Toaster position="top-right" />
      </>
    )
  }

  // Main gallery view
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header 
          onShowAdmin={() => setCurrentView('admin')}
          isAdminView={false}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mx-auto mb-6 shadow-lg">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Nata Foto
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Una colección personal de momentos capturados a través del lente. 
              Explora la belleza en cada imagen y descubre historias únicas.
            </p>
            
            {/* Upload section for public users */}
            {!showUploadForm ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-8 py-3 h-auto shadow-lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Subir Foto
                </Button>
                
                {!isAuthenticated && (
                  <Button
                    onClick={() => setCurrentView('admin')}
                    variant="outline"
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 px-8 py-3 h-auto"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Panel Administrador
                  </Button>
                )}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <UploadForm onSuccess={handleUploadSuccess} />
                <Button
                  onClick={() => setShowUploadForm(false)}
                  variant="ghost"
                  className="mt-4 text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          {/* Gallery */}
          {!showUploadForm && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Galería Fotográfica
                </h2>
                <p className="text-gray-600">
                  Descubre momentos únicos capturados con pasión
                </p>
              </div>
              
              <PhotoGallery />
            </div>
          )}
        </main>
      </div>
      
      <Toaster position="top-right" />
    </>
  )
}

export default App