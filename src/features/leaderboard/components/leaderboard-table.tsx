'use client'

import { useLeaderboard } from '../hooks/use-leaderboard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'

const GOAL_LABELS: Record<string, string> = {
  weight_loss: 'Perder peso',
  weight_gain: 'Ganar masa',
  body_recomp: 'Recomposición',
}

export function LeaderboardTable({ challengeId }: { challengeId?: string }) {
  const { data: leaderboard, isLoading, isError } = useLeaderboard(challengeId)

  if (isLoading) {
    return (
      <div className="w-full space-y-3 py-8 text-center text-zinc-500">
        Cargando posiciones...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full py-8 text-center text-red-400">
        Error al cargar la tabla de posiciones.
      </div>
    )
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="w-full py-8 text-center text-zinc-500">
        Aún no hay participantes registrados en este reto.
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 backdrop-blur">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-16 text-center font-bold text-zinc-400">#</TableHead>
            <TableHead className="text-zinc-400">Participante</TableHead>
            <TableHead className="hidden sm:table-cell text-zinc-400">Objetivo</TableHead>
            <TableHead className="text-right text-zinc-400">Cumplimiento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((item, index) => {
            const position = index + 1
            const isTop3 = position <= 3

            return (
              <TableRow key={item.participant_id} className="border-zinc-800/60 hover:bg-zinc-900/40 transition-colors">
                <TableCell className="text-center font-mono font-bold">
                  {position === 1 && <span className="text-amber-400">🥇 1</span>}
                  {position === 2 && <span className="text-zinc-300">🥈 2</span>}
                  {position === 3 && <span className="text-amber-700">🥉 3</span>}
                  {position > 3 && <span className="text-zinc-500">{position}</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      <AvatarImage src={item.avatar_url || ''} alt={item.full_name || ''} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs">
                        {item.full_name?.substring(0, 2).toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-zinc-100">{item.full_name}</p>
                      <span className="sm:hidden text-[11px] text-zinc-500 block">
                        {GOAL_LABELS[item.goal_type || 'weight_loss']}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="border-zinc-800 bg-zinc-900/60 text-zinc-300 font-normal">
                    {GOAL_LABELS[item.goal_type || 'weight_loss']}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className={`font-mono font-bold text-base ${isTop3 ? 'text-emerald-400' : 'text-zinc-200'}`}>
                      {item.progress_percentage}%
                    </span>
                    <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1 hidden sm:block">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.progress_percentage || 0)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}