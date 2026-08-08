import { LayoutDashboard, PencilRuler, Settings, ShieldCheck, Upload } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../app/providers/auth-provider'
import { Button } from '../ui/button'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/home', label: 'Home CMS', icon: PencilRuler },
  { to: '/admin/about', label: 'About CMS', icon: PencilRuler },
  { to: '/admin/experience', label: 'Experience', icon: PencilRuler },
  { to: '/admin/projects', label: 'Projects', icon: PencilRuler },
  { to: '/admin/skills', label: 'Skills', icon: PencilRuler },
  { to: '/admin/blog/posts', label: 'Blog Posts', icon: PencilRuler },
  { to: '/admin/blog/categories', label: 'Categories', icon: PencilRuler },
  { to: '/admin/blog/tags', label: 'Tags', icon: PencilRuler },
  { to: '/admin/uploads', label: 'Uploads', icon: Upload },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <aside className="glass-panel flex flex-col rounded-[2rem] p-5">
          <div className="border-b border-[var(--border)] pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Admin Portal</p>
            <h1 className="display-title mt-3 text-3xl">Control center</h1>
            <p className="mt-3 text-sm text-[var(--muted)]">Signed in as {user?.email}</p>
          </div>
          <nav className="mt-5 flex flex-1 flex-col gap-2">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                      isActive ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-strong)] text-[var(--foreground)]',
                    ].join(' ')
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
          <Button type="button" variant="secondary" className="mt-5" onClick={() => void logout()}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </aside>

        <main className="glass-panel rounded-[2rem] p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}