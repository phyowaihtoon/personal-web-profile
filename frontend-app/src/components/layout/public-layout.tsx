import { useQuery } from '@tanstack/react-query'
import { NavLink, Outlet } from 'react-router-dom'

import { useLocale } from '../../app/providers/locale-provider'
import { publicApi } from '../../lib/api/public'
import { LanguageToggle } from '../locale/language-toggle'
import { ThemeToggle } from '../theme/theme-toggle'

const navItems = [
  { to: '/', key: 'home' },
  { to: '/experience', key: 'experience' },
  { to: '/blog', key: 'blog' },
  { to: '/about', key: 'about' },
] as const

export function PublicLayout() {
  const { messages } = useLocale()
  const settingsQuery = useQuery({ queryKey: ['site-settings'], queryFn: publicApi.getSiteSettings })

  const email = settingsQuery.data?.contactInfo?.email
  const location = settingsQuery.data?.contactInfo?.location
  const socialLinks = settingsQuery.data?.socialLinks ?? []

  return (
    <div className="app-shell">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-5">
          <div className="pointer-events-none absolute -left-16 -top-12 h-44 w-44 rounded-full bg-[var(--accent-soft)] blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-14 h-52 w-52 rounded-full bg-[var(--accent-soft)] blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] p-1 shadow-sm shadow-black/5">
                <img
                  src="/profile-photo.jpg"
                  alt="Phyo Wai Htoon profile"
                  className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                />
              </div>
              <div>
                <h1 className="display-title text-3xl text-[var(--foreground)] sm:text-4xl">Phyo Wai Htoon</h1>
                <p className="mt-1 text-sm font-medium text-[var(--muted)]">Senior Software Engineer</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'rounded-full px-4 py-2 text-sm transition',
                        isActive
                          ? 'bg-[var(--accent)] text-white shadow-md shadow-[color:var(--ring)]'
                          : 'bg-[var(--surface-strong)] text-[var(--foreground)] hover:bg-[var(--accent-soft)]',
                      ].join(' ')
                    }
                  >
                    {messages.nav[item.key]}
                  </NavLink>
                ))}
              </nav>
              <div className="flex flex-wrap gap-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-8">
          <Outlet />
        </main>

        <footer className="glass-panel mt-4 rounded-[2rem] px-6 py-4 text-sm text-[var(--muted)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mt-2 text-xs tracking-[0.2em]">
                {email || location ? (
                  <>
                    Reach me via {email ? <span className="font-bold text-[var(--foreground)]">{email}</span> : null}
                    {email && location ? ' , ' : ''}
                    {location ?? ''}
                  </>
                ) : (
                  'CMS-managed contact information'
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((link) => (
                <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className="font-semibold text-[var(--accent)]">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}