'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/shared/lib/supabase/client'
import { loginSchema, type LoginInput } from '../schemas/auth.schema'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import Link from 'next/link'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error('Error al iniciar sesión', {
          description: 'Credenciales inválidas. Verifica tu correo y contraseña.',
        })
        return
      }

      toast.success('¡Bienvenido de nuevo!')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">FitChallenge</CardTitle>
        <CardDescription className="text-zinc-400">
          Ingresa tus credenciales para acceder a tu panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              className="border-zinc-800 bg-zinc-900/50 focus-visible:ring-zinc-400"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              className="border-zinc-800 bg-zinc-900/50 focus-visible:ring-zinc-400"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
          <div className="text-center text-xs text-zinc-400 pt-2">
            <Link href="/forgot-password" className="text-xs text-emerald-400 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="text-center text-xs text-zinc-400 pt-2">
            ¿No tienes una cuenta aún?{' '}
            <Link href="/register" className="text-emerald-400 hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}