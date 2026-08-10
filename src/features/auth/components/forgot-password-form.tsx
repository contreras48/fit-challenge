'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Usamos window.location.origin para que funcione dinámicamente en local y en Vercel
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })

      if (error) throw error

      setIsSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al enviar el correo de recuperación'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-bold text-white">¡Revisa tu correo! 📬</CardTitle>
          <CardDescription className="text-zinc-400">
            Hemos enviado un enlace de recuperación a <strong className="text-white">{email}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/login" className="text-sm text-emerald-400 hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Recuperar Contraseña</CardTitle>
        <CardDescription className="text-zinc-400">
          Ingresa tu correo y te enviaremos las instrucciones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetRequest} className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-200">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-zinc-800 bg-zinc-900/50 text-white focus-visible:ring-zinc-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>

          <div className="text-center text-xs text-zinc-400 pt-2">
            ¿Recordaste tu contraseña?{' '}
            <Link href="/login" className="text-emerald-400 hover:underline">
              Volver al Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}