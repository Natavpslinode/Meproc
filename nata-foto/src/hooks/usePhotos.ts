import { useState, useEffect, useCallback } from 'react'
import { Photo, PhotoStats, invokeEdgeFunction, fileToBase64, isValidImageFile } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { useAuth } from './useAuth'

export const usePhotos = () => {
  const { sessionToken } = useAuth()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [stats, setStats] = useState<PhotoStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Obtener fotos públicas para la galería
  const fetchPublicPhotos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await invokeEdgeFunction('manage-photos', {
        action: 'get-public'
      })
      
      setPhotos(response.data.photos || [])
    } catch (error: any) {
      console.error('Error fetching public photos:', error)
      toast.error('Error al cargar las fotos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Obtener todas las fotos para el panel de administrador
  const fetchAllPhotos = useCallback(async () => {
    if (!sessionToken) {
      toast.error('Sesión requerida')
      return
    }

    try {
      setLoading(true)
      const response = await invokeEdgeFunction('manage-photos', {
        action: 'get-all-admin',
        sessionToken
      })
      
      setPhotos(response.data.photos || [])
    } catch (error: any) {
      console.error('Error fetching all photos:', error)
      toast.error('Error al cargar las fotos')
    } finally {
      setLoading(false)
    }
  }, [sessionToken])

  // Obtener estadísticas para el panel de administrador
  const fetchStats = useCallback(async () => {
    if (!sessionToken) return

    try {
      const response = await invokeEdgeFunction('manage-photos', {
        action: 'get-stats',
        sessionToken
      })
      
      setStats(response.data)
    } catch (error: any) {
      console.error('Error fetching stats:', error)
    }
  }, [sessionToken])

  // Subir foto
  const uploadPhoto = useCallback(async (
    file: File,
    title: string,
    description?: string,
    category?: string
  ) => {
    if (!isValidImageFile(file)) {
      toast.error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)')
      return false
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error('El archivo no puede exceder 10MB')
      return false
    }

    try {
      setUploading(true)
      
      // Convertir archivo a base64
      const imageData = await fileToBase64(file)
      
      const response = await invokeEdgeFunction('upload-photo', {
        imageData,
        fileName: file.name,
        title,
        description,
        category
      })
      
      if (response.data.photo) {
        toast.success(response.data.message || 'Foto subida exitosamente')
        
        // Actualizar lista de fotos
        setPhotos(prev => [response.data.photo, ...prev])
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Error al subir la foto')
      return false
    } finally {
      setUploading(false)
    }
  }, [])

  // Eliminar foto
  const deletePhoto = useCallback(async (photoId: number) => {
    if (!sessionToken) {
      toast.error('Sesión requerida')
      return false
    }

    try {
      const response = await invokeEdgeFunction('manage-photos', {
        action: 'delete',
        photoId,
        sessionToken
      })
      
      if (response.data.success) {
        toast.success(response.data.message || 'Foto eliminada exitosamente')
        
        // Actualizar lista de fotos
        setPhotos(prev => prev.filter(photo => photo.id !== photoId))
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Error al eliminar la foto')
      return false
    }
  }, [sessionToken])

  // Actualizar foto
  const updatePhoto = useCallback(async (
    photoId: number,
    updateData: Partial<Photo>
  ) => {
    if (!sessionToken) {
      toast.error('Sesión requerida')
      return false
    }

    try {
      const response = await invokeEdgeFunction('manage-photos', {
        action: 'update',
        photoId,
        updateData,
        sessionToken
      })
      
      if (response.data.success) {
        toast.success(response.data.message || 'Foto actualizada exitosamente')
        
        // Actualizar lista de fotos
        setPhotos(prev => prev.map(photo => 
          photo.id === photoId ? { ...photo, ...response.data.photo } : photo
        ))
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error.message || 'Error al actualizar la foto')
      return false
    }
  }, [sessionToken])

  return {
    photos,
    stats,
    loading,
    uploading,
    fetchPublicPhotos,
    fetchAllPhotos,
    fetchStats,
    uploadPhoto,
    deletePhoto,
    updatePhoto
  }
}