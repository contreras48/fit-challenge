'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'
import { AvatarUpload } from '@/features/profiles/components/avatar-upload'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

interface ProfileFormProps {
  user: {
    id: string
    full_name?: string | null
    avatar_url?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [fullName, setFullName] = useState(user.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar_url || null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Guardar el nombre y la nueva avatar_url en la tabla 'profiles'
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error('Error guardando perfil:', err)
      alert('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {/* 1. COMPONENTE DE CARGA DE AVATAR */}
      <AvatarUpload
        userId={user.id}
        currentAvatarUrl={avatarUrl}
        onUploadComplete={(url) => setAvatarUrl(url)}
      />

      {/* 2. CAMPO DE NOMBRE COMPLETO */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-zinc-200">Nombre Completo</Label>
        <Input
          id="fullName"
          type="text"
          required
          placeholder="Ej. Juan Pérez"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border-zinc-800 bg-zinc-900/50 text-white"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Guardando...' : 'Guardar Perfil'}
      </Button>
    </form>
  )
}