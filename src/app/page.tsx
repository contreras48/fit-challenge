import Link from 'next/link'
import { createClient } from '@/shared/lib/supabase/server'
import { LeaderboardTable } from '@/features/leaderboard/components/leaderboard-table'
import { Button } from '@/shared/components/ui/button'

export const revalidate = 60 // Revalida la página cada 60 segundos

export default async function HomePage() {
  const supabase = await createClient()

  // Obtenemos el reto activo para la V1
  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .single()

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
      {/* Navbar Minimalista */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">FitChallenge</span>
          <Link href="/login">
            <Button variant="outline" className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200">
              Mi Cuenta
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            {challenge?.title || 'Reto de Transformación Física'}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg text-balance">
            {challenge?.description || 'Medimos el esfuerzo real mediante el porcentaje de avance hacia la meta personal.'}
          </p>
        </section>

        {/* Seccion del Ranking */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Tabla de Posiciones</h2>
              <p className="text-xs text-zinc-500">Ordenado por porcentaje de cumplimiento de meta</p>
            </div>
          </div>

          <LeaderboardTable challengeId={challenge?.id} />
        </section>
      </main>
    </div>
  )
}