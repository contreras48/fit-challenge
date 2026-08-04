'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Redirigir al dashboard para que complete su perfil y metas
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar la cuenta'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Crear una Cuenta</CardTitle>
        <CardDescription className="text-zinc-400">
          Unete al reto para registrar tu progreso semanal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-200">Contraseña</Label>
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

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarme e Iniciar'}
          </Button>

          <div className="text-center text-xs text-zinc-400 pt-2">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-emerald-400 hover:underline">
              Inicia Sesión
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}