import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { usePhotos } from '@/hooks/usePhotos'
import { isValidImageFile, formatFileSize } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface UploadFormProps {
  onSuccess?: () => void
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('general')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const { uploadPhoto, uploading } = usePhotos()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!isValidImageFile(file)) {
      toast.error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('El archivo no puede exceder 10MB')
      return
    }

    setSelectedFile(file)
    setTitle(file.name.replace(/\.[^/.]+$/, '')) // Remove extension
    
    // Create preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const clearFile = () => {
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setCategory('general')
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error('Por favor selecciona una imagen')
      return
    }

    if (!title.trim()) {
      toast.error('Por favor ingresa un título')
      return
    }

    const success = await uploadPhoto(
      selectedFile,
      title.trim(),
      description.trim() || undefined,
      category
    )

    if (success) {
      clearFile()
      onSuccess?.()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Subir Nueva Foto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive
                ? 'border-amber-400 bg-amber-50'
                : 'border-gray-300 hover:border-amber-300 hover:bg-amber-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
            </h3>
            <p className="text-gray-600">
              Formatos soportados: JPEG, PNG, GIF, WebP (máx. 10MB)
            </p>
          </div>
        ) : (
          /* Preview */
          <div className="relative">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{selectedFile.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatFileSize(selectedFile.size)}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedFile.type}
                </p>
              </div>
              <Button
                type="button"
                onClick={clearFile}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Form fields */}
        {selectedFile && (
          <>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la foto"
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional de la foto..."
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 py-1 text-sm bg-transparent border border-amber-200 rounded-md shadow-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              >
                <option value="general">General</option>
                <option value="paisajes">Paisajes</option>
                <option value="retratos">Retratos</option>
                <option value="eventos">Eventos</option>
                <option value="macro">Macro</option>
                <option value="arquitectura">Arquitectura</option>
                <option value="naturaleza">Naturaleza</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={uploading || !title.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 h-auto"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Subir Foto
                </>
              )}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}