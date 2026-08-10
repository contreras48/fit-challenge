'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar la contraseña'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Nueva Contraseña</CardTitle>
        <CardDescription className="text-zinc-400">
          Ingresa tu nueva contraseña para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-200">Nueva Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-200">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Cambiar Contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}