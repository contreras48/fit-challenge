'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/shared/lib/supabase/client'
import { checkInSchema, type CheckInInput } from '../schemas/check-in.schema'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface CheckInFormProps {
  participantId: string
}

export function CheckInForm({ participantId }: CheckInFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckInInput>({
    resolver: zodResolver(checkInSchema),
  })

  async function onSubmit(data: CheckInInput) {
    setIsLoading(true)
    try {
      const { error } = await supabase.from('check_ins').insert({
        participant_id: participantId,
        weight: Number(data.weight),
        chest_cm: data.chest_cm ? Number(data.chest_cm) : null,
        waist_cm: data.waist_cm ? Number(data.waist_cm) : null,
        hip_cm: data.hip_cm ? Number(data.hip_cm) : null,
        notes: data.notes || null,
      })

      if (error) {
        toast.error('Error al registrar tu avance', { description: error.message })
        return
      }

      toast.success('¡Registro guardado correctamente!')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-zinc-800 bg-zinc-950/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Nuevo Registro de Progreso</CardTitle>
        <CardDescription className="text-zinc-400">
          Ingresa tu peso actual para actualizar tu avance en el ranking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-zinc-200">Peso Actual (lb) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              placeholder="Ej: 175.50"
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
              {...register('weight')}
            />
            {errors.weight && <p className="text-xs text-red-400">{errors.weight.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="chest_cm" className="text-xs text-zinc-400">Pecho (cm)</Label>
              <Input
                id="chest_cm"
                type="number"
                step="0.1"
                placeholder="95"
                className="border-zinc-800 bg-zinc-900/50 text-white text-xs"
                {...register('chest_cm')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waist_cm" className="text-xs text-zinc-400">Cintura (cm)</Label>
              <Input
                id="waist_cm"
                type="number"
                step="0.1"
                placeholder="80"
                className="border-zinc-800 bg-zinc-900/50 text-white text-xs"
                {...register('waist_cm')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hip_cm" className="text-xs text-zinc-400">Cadera (cm)</Label>
              <Input
                id="hip_cm"
                type="number"
                step="0.1"
                placeholder="100"
                className="border-zinc-800 bg-zinc-900/50 text-white text-xs"
                {...register('hip_cm')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-zinc-200">Notas u Observaciones</Label>
            <Input
              id="notes"
              type="text"
              placeholder="¿Cómo te sentiste esta semana?"
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
              {...register('notes')}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Registrar Avance'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}