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

export function BootstrapPage() {
  const navigate = useNavigate()
  const { bootstrap, errorMessage } = useAuth()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    document.title = 'Admin · Bootstrap'
  }, [])

  const onSubmit = form.handleSubmit(async (values) => {
    await bootstrap(values)
    navigate('/admin')
  })

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">Bootstrap</p>
        <h1 className="display-title mt-3 text-3xl">Create the first admin</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">This flow is available only until the first admin exists.</p>
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
            {form.formState.isSubmitting ? 'Creating...' : 'Create admin'}
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={() => navigate('/admin/login')}>
            Back to login
          </Button>
        </form>
      </Card>
    </div>
  )
}