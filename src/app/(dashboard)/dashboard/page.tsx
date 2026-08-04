import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { WeightChart } from '@/features/progress/components/weight-chart'
import { JoinChallengeForm } from '@/features/challenges/components/join-challenge-form'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { LogoutButton } from '@/shared/components/ui/logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 1. Obtener la participación del usuario activo
  const { data: participant } = await supabase
    .from('challenge_participants')
    .select('*, profiles(full_name)')
    .eq('user_id', user.id)
    .maybeSingle()

  // 2. Si no está inscrito, obtener el reto activo y mostrar el formulario de onboarding
  if (!participant) {
    const { data: activeChallenge } = await supabase
      .from('challenges')
      .select('id, title')
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()

    if (!activeChallenge) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 space-y-4">
          <p className="text-zinc-400">No hay ningún reto activo en este momento.</p>
          <Link href="/">
            <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-200">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      )
    }

    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <JoinChallengeForm challengeId={activeChallenge.id} userId={user.id} />
      </main>
    )
  }

  // 3. Si ya está inscrito, cargar su historial de check-ins normalmente
  const { data: checkIns } = await supabase
    .from('check_ins')
    .select('*')
    .eq('participant_id', participant.id)
    .order('check_in_date', { ascending: true })

  const currentCheckIn = checkIns && checkIns.length > 0 ? checkIns[checkIns.length - 1] : null
  const currentWeight = currentCheckIn ? currentCheckIn.weight : participant.initial_weight

  const totalDifference = Math.abs(participant.initial_weight - participant.target_weight)
  const currentDifference = Math.abs(participant.initial_weight - currentWeight)
  const progressPercentage =
    totalDifference > 0
      ? Math.min(100, Math.round((currentDifference / totalDifference) * 100))
      : 100

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            FitChallenge
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/check-in">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
                + Registrar Peso
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hola, {participant.profiles?.full_name || 'Participante'} 👋
          </h1>
          <p className="text-zinc-400 text-sm">Resumen de tu progreso en el reto actual.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-normal text-zinc-400">Peso Inicial</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-mono font-bold text-white">{participant.initial_weight} kg</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-normal text-zinc-400">Peso Actual</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-mono font-bold text-emerald-400">{currentWeight} kg</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-normal text-zinc-400">Peso Meta</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-mono font-bold text-rose-400">{participant.target_weight} kg</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-normal text-zinc-400">Cumplimiento</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-mono font-bold text-emerald-400">{progressPercentage}%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-zinc-800 bg-zinc-950/40 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Evolución de Peso</h2>
            <p className="text-xs text-zinc-400">
              Línea verde: tus check-ins. Línea roja punteada: tu peso meta.
            </p>
          </div>
          {checkIns && checkIns.length > 0 ? (
            <WeightChart data={checkIns} targetWeight={participant.target_weight} />
          ) : (
            <p className="text-center text-zinc-500 py-12">
              Aún no has registrado ningún peso. Haz clic en "+ Registrar Peso" para comenzar.
            </p>
          )}
        </Card>
      </main>
    </div>
  )
}