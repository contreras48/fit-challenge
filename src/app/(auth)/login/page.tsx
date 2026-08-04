import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white selection:bg-zinc-800">
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </main>
  )
}