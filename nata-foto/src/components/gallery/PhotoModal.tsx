import React from 'react'
import { X, Calendar, Tag, Download } from 'lucide-react'
import { Photo } from '@/lib/supabase'
import { formatDate, getImageAlt } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PhotoModalProps {
  photo: Photo
  isOpen: boolean
  onClose: () => void
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, isOpen, onClose }) => {
  if (!isOpen) return null

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = photo.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {photo.title}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <img
              src={photo.image_url}
              alt={getImageAlt(photo.title, photo.description)}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
          
          {/* Info sidebar */}
          <div className="lg:w-80 p-6 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Título y descripción */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {photo.description}
                  </p>
                )}
              </div>
              
              {/* Metadatos */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(photo.uploaded_at)}</span>
                </div>
                
                {photo.category && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="capitalize">{photo.category}</span>
                  </div>
                )}
                
                {photo.uploader_name && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Subida por:</span> {photo.uploader_name}
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Información técnica */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Detalles</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {photo.file_size && (
                    <div>Tamaño: {(photo.file_size / 1024 / 1024).toFixed(2)} MB</div>
                  )}
                  {photo.mime_type && (
                    <div>Tipo: {photo.mime_type.replace('image/', '').toUpperCase()}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}