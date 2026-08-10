'use client'

import { useState } from 'react'
import { createClient } from '@/shared/lib/supabase/client'
import { User, Upload, Loader2 } from 'lucide-react'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string | null
  onUploadComplete: (url: string) => void
}

export function AvatarUpload({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/avatar.${fileExt}`

      // Subir imagen a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Obtener URL pública de la imagen subida
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Agregar timestamp para evitar cache en el navegador
      const finalUrl = `${publicUrl}?t=${Date.now()}`
      
      setAvatarUrl(finalUrl)
      onUploadComplete(finalUrl)
    } catch (err) {
      console.error('Error al subir avatar:', err)
      alert('Hubo un problema al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center group">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-zinc-500" />
        )}

        {/* Overlay al pasar el cursor / cargar */}
        <label 
          htmlFor="avatar-input" 
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-white" />
          )}
        </label>
      </div>

      <input 
        id="avatar-input" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <span className="text-xs text-zinc-400">Toca la foto para cambiarla</span>
    </div>
  )
}