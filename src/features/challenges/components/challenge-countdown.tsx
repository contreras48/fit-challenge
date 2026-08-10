'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface ChallengeCountdownProps {
  endDate: string
}

export function ChallengeCountdown({ endDate }: ChallengeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isEnded: boolean
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(endDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isEnded: false,
      }
    }

    // Cálculo inicial
    setTimeLeft(calculateTimeLeft())

    // Actualizar cada segundo
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  // Estado de carga mientras se monta en el cliente
  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-zinc-500 text-sm animate-pulse">
        <Clock className="w-4 h-4" />
        <span>Calculando tiempo restante...</span>
      </div>
    )
  }

  if (timeLeft.isEnded) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold">
        <Clock className="w-4 h-4" />
        <span>¡El reto ha finalizado!</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
        <Clock className="w-4 h-4" />
        <span>Tiempo restante del reto</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="flex flex-col p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl min-w-[65px]">
          <span className="text-2xl font-bold text-white font-mono">{timeLeft.days}</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Días</span>
        </div>
        <div className="flex flex-col p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl min-w-[65px]">
          <span className="text-2xl font-bold text-white font-mono">{timeLeft.hours}</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Horas</span>
        </div>
        <div className="flex flex-col p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl min-w-[65px]">
          <span className="text-2xl font-bold text-white font-mono">{timeLeft.minutes}</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Min</span>
        </div>
        <div className="flex flex-col p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl min-w-[65px]">
          <span className="text-2xl font-bold text-emerald-400 font-mono">{timeLeft.seconds}</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Seg</span>
        </div>
      </div>
    </div>
  )
}