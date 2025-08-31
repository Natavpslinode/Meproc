import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase para Nata Foto
const supabaseUrl = 'https://slbcalwijjvbyjcetilg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsYmNhbHdpamp2YnlqY2V0aWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNTc3ODcsImV4cCI6MjA3MTczMzc4N30.JfIch1JfC9yx8kgwQi2c5EPJ_DIu432xnZD_-mmpAkk'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la aplicación
export interface Photo {
  id: number
  title: string
  description?: string
  image_url: string
  file_name: string
  file_size?: number
  mime_type?: string
  uploaded_at: string
  is_public: boolean
  uploader_name?: string
  category?: string
  tags?: string[]
}

export interface AdminUser {
  id: number
  username: string
  email: string
  full_name?: string
  is_active: boolean
  created_at: string
  last_login?: string
}

export interface PhotoStats {
  totalPhotos: number
  totalSize: number
  thisMonthPhotos: number
  averageSize: number
}

// Funciones utilitarias para Supabase
export const invokeEdgeFunction = async (functionName: string, body: any) => {
  const { data, error } = await supabase.functions.invoke(functionName, { body })
  
  if (error) {
    console.error(`Error invoking ${functionName}:`, error)
    throw error
  }
  
  return data
}

// Formatear tamaño de archivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validar tipo de archivo
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

// Convertir archivo a base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}