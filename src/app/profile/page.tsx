import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { ProfileForm } from '@/features/profiles/components/profile-form'
import { Button } from '@/shared/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()

  // 1. Verificar sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 2. Obtener datos actuales del perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto space-y-6 pt-6">
        {/* Botón de regreso al Dashboard */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Editar Perfil</h1>
          <p className="text-sm text-zinc-400">
            Actualiza tu nombre y tu foto de perfil para la tabla de posiciones.
          </p>
        </div>

        {/* Formulario de actualización */}
        <ProfileForm
          user={{
            id: user.id,
            full_name: profile?.full_name,
            avatar_url: profile?.avatar_url,
          }}
        />
      </div>
    </main>
  )
}