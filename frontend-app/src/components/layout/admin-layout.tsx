import { LayoutDashboard, PencilRuler, Settings, ShieldCheck, Upload } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../app/providers/auth-provider'
import { Button } from '../ui/button'

const groups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/home', label: 'Home CMS', icon: PencilRuler },
      { to: '/admin/about', label: 'About CMS', icon: PencilRuler },
      { to: '/admin/experience', label: 'Experience', icon: PencilRuler },
      { to: '/admin/projects', label: 'Projects', icon: PencilRuler },
      { to: '/admin/skills', label: 'Skills', icon: PencilRuler },
    ],
  },
  {
    label: 'Blog',
    items: [
      { to: '/admin/blog/posts', label: 'Blog Posts', icon: PencilRuler },
      { to: '/admin/blog/categories', label: 'Categories', icon: PencilRuler },
      { to: '/admin/blog/tags', label: 'Tags', icon: PencilRuler },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/uploads', label: 'Uploads', icon: Upload },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-6">
        <aside className="surface-panel flex flex-col rounded-md p-4">
          <div className="border-b border-[var(--border)] pb-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">Admin</p>
            <h1 className="mt-2 text-lg font-semibold">Control center</h1>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{user?.email}</p>
          </div>
          <nav className="mt-4 flex flex-1 flex-col gap-5" aria-label="Admin">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">{group.label}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin'}
                        className={({ isActive }) =>
                          [
                            'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                            isActive
                              ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
                              : 'text-[var(--foreground)] hover:bg-[var(--accent-soft)]',
                          ].join(' ')
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => void logout()}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </aside>

        <main className="surface-panel rounded-md p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
