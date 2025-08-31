import React, { useEffect, useState } from 'react'
import { Settings, Image as ImageIcon, Trash2, BarChart3, Upload, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Photo, formatFileSize } from '@/lib/supabase'
import { usePhotos } from '@/hooks/usePhotos'
import { formatDate } from '@/lib/utils'
import { UploadForm } from '@/components/upload/UploadForm'
import { toast } from 'react-hot-toast'

interface AdminPanelProps {
  onBack: () => void
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { photos, stats, loading, fetchAllPhotos, fetchStats, deletePhoto } = usePhotos()
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'upload'>('overview')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    fetchAllPhotos()
    fetchStats()
  }, [])

  const handleDeletePhoto = async (photoId: number) => {
    if (deleteConfirm !== photoId) {
      setDeleteConfirm(photoId)
      setTimeout(() => setDeleteConfirm(null), 3000) // Auto-reset after 3 seconds
      return
    }

    const success = await deletePhoto(photoId)
    if (success) {
      setDeleteConfirm(null)
      fetchStats() // Update stats after deletion
    }
  }

  const handleUploadSuccess = () => {
    fetchAllPhotos()
    fetchStats()
    setActiveTab('photos')
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'photos', label: 'Fotos', icon: ImageIcon },
    { id: 'upload', label: 'Subir', icon: Upload },
  ] as const

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Galería
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-amber-500" />
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tu galería fotográfica
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Fotos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPhotos}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Este Mes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.thisMonthPhotos}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Almacenamiento</p>
                    <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.averageSize)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay fotos
              </h3>
              <p className="text-gray-600">
                Sube tu primera foto para comenzar.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Todas las Fotos ({photos.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {photos.map((photo) => (
                  <div key={photo.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {photo.title}
                        </h4>
                        {photo.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{formatDate(photo.uploaded_at)}</span>
                          {photo.file_size && (
                            <span>{formatFileSize(photo.file_size)}</span>
                          )}
                          {photo.category && (
                            <span className="capitalize">{photo.category}</span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleDeletePhoto(photo.id)}
                        variant={deleteConfirm === photo.id ? 'destructive' : 'ghost'}
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleteConfirm === photo.id ? 'Confirmar' : 'Eliminar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="max-w-2xl">
          <UploadForm onSuccess={handleUploadSuccess} />
        </div>
      )}
    </div>
  )
}