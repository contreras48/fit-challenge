'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface JoinChallengeFormProps {
  challengeId: string
  userId: string
}

export function JoinChallengeForm({ challengeId, userId }: JoinChallengeFormProps) {
  const [fullName, setFullName] = useState('')
  const [goalType, setGoalType] = useState<'weight_loss' | 'weight_gain'>('weight_loss')
  const [initialWeight, setInitialWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Crear o actualizar el perfil con el nombre ingresado por el usuario
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: fullName.trim(),
      }, { onConflict: 'id' })

      if (profileError) throw profileError

      // 2. Crear la participación en el reto
      const { error: participantError } = await supabase.from('challenge_participants').insert({
        challenge_id: challengeId,
        user_id: userId,
        goal_type: goalType,
        initial_weight: Number(initialWeight),
        target_weight: Number(targetWeight),
      })

      if (participantError) throw participantError

      // Refrescar la vista
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al unirse al reto'
      alert(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-white">¡Bienvenido al Reto! 🏋️‍♂️</CardTitle>
        <CardDescription className="text-zinc-400">
          Configura tus datos y meta para comenzar tu seguimiento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-zinc-200">
              Nombre Completo
            </Label>
            <Input
              id="full_name"
              type="text"
              required
              placeholder="Ej: Carlos Contreras"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-200">Tipo de Objetivo</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={goalType === 'weight_loss' ? 'default' : 'outline'}
                className={
                  goalType === 'weight_loss'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-medium'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white'
                }
                onClick={() => setGoalType('weight_loss')}
              >
                Perder Peso
              </Button>
              <Button
                type="button"
                variant={goalType === 'weight_gain' ? 'default' : 'outline'}
                className={
                  goalType === 'weight_gain'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-medium'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white'
                }
                onClick={() => setGoalType('weight_gain')}
              >
                Ganar Masa
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial_weight" className="text-zinc-200">
              Peso Inicial (lb)
            </Label>
            <Input
              id="initial_weight"
              type="number"
              step="0.01"
              required
              placeholder="Ej: 185.50"
              value={initialWeight}
              onChange={(e) => setInitialWeight(e.target.value)}
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_weight" className="text-zinc-200">
              Peso Meta (lb)
            </Label>
            <Input
              id="target_weight"
              type="number"
              step="0.01"
              required
              placeholder="Ej: 175.00"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Inscribiendo...' : 'Comenzar Mi Reto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}