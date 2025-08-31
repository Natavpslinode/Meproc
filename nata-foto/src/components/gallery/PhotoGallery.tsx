import React, { useEffect, useState } from 'react'
import { Image as ImageIcon, Clock, Eye } from 'lucide-react'
import { Photo } from '@/lib/supabase'
import { usePhotos } from '@/hooks/usePhotos'
import { formatDate, getImageAlt } from '@/lib/utils'
import { PhotoModal } from './PhotoModal'

export const PhotoGallery: React.FC = () => {
  const { photos, loading, fetchPublicPhotos } = usePhotos()
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    fetchPublicPhotos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando galería...</p>
        </div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No hay fotos aún
        </h3>
        <p className="text-gray-600">
          Las fotos aparecerán aquí una vez que sean subidas.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
              <img
                src={photo.image_url}
                alt={getImageAlt(photo.title, photo.description)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading={index < 8 ? 'eager' : 'lazy'}
              />
              
              {/* Overlay con información */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm mb-1 truncate">
                    {photo.title}
                  </h3>
                  <div className="flex items-center text-white/80 text-xs space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(photo.uploaded_at)}</span>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para ver foto en grande */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  )
}