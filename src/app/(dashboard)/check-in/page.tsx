import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { CheckInForm } from '@/features/progress/components/check-in-form'

export default async function CheckInPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: participant } = await supabase
    .from('challenge_participants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!participant) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <p className="text-zinc-400 text-center">No estás inscrito en ningún reto activo actualmente.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <CheckInForm participantId={participant.id} />
    </main>
  )
}