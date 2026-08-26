import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../../app/providers/auth-provider'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { login, errorMessage } = useAuth()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    document.title = 'Admin · Sign in'
  }, [])

  const onSubmit = form.handleSubmit(async (values) => {
    await login(values)
    navigate('/admin')
  })

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">Admin</p>
        <h1 className="display-title mt-3 text-3xl">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Use the bootstrap flow only for the first admin account.</p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input type="email" {...form.register('email')} />
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.email?.message}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <Input type="password" {...form.register('password')} />
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.password?.message}</p>
          </div>
          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={() => navigate('/admin/bootstrap')}>
            First-time bootstrap
          </Button>
        </form>
      </Card>
    </div>
  )
}