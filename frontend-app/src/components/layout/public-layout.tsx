import { useQuery } from '@tanstack/react-query'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useLocale } from '../../app/providers/locale-provider'
import { publicApi } from '../../lib/api/public'
import { LanguageToggle } from '../locale/language-toggle'

const navItems = [
  { to: '/', key: 'home' },
  { to: '/experience', key: 'experience' },
  { to: '/blog', key: 'blog' },
  { to: '/about', key: 'about' },
] as const

export function PublicLayout() {
  const { locale, messages } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const settingsQuery = useQuery({ queryKey: ['site-settings'], queryFn: publicApi.getSiteSettings })

  const email = settingsQuery.data?.contactInfo?.email
  const location = settingsQuery.data?.contactInfo?.location
  const socialLinks = settingsQuery.data?.socialLinks ?? []
  const siteTitle =
    settingsQuery.data?.siteTitle?.[locale] ?? settingsQuery.data?.siteTitle?.en ?? messages.brand.name

  useEffect(() => {
    document.title = siteTitle
  }, [siteTitle])

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link sr-only">
        {messages.a11y.skipToContent}
      </a>

      <header className="site-header sticky top-0 z-40">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-4 px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-[auto_minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src="/profile-photo.jpg"
              alt={messages.home.photoAlt}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-white/20 sm:h-20 sm:w-20"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-bold tracking-tight text-[var(--header-fg)] sm:text-xl">{messages.brand.name}</p>
              <p className="truncate text-sm text-[var(--header-muted)]">{messages.brand.role}</p>
            </div>
          </div>

          <nav className="hidden items-center justify-center gap-7 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'text-sm transition-colors',
                    isActive
                      ? 'font-semibold text-white underline decoration-[1.5px] underline-offset-[10px]'
                      : 'text-[var(--header-muted)] hover:text-white',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>{messages.nav[item.key]}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <LanguageToggle variant="onDark" />
            <button
              type="button"
              className="rounded-md p-2 text-[var(--header-fg)] md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? messages.nav.closeMenu : messages.nav.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav id="mobile-nav" className="border-t border-[var(--header-border)] px-4 py-3 md:hidden" aria-label="Primary">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-md px-2 py-2.5 text-sm',
                      isActive ? 'bg-white/10 font-semibold text-white' : 'text-[var(--header-muted)] hover:text-white',
                    ].join(' ')
                  }
                >
                  {messages.nav[item.key]}
                </NavLink>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-[var(--muted)] sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-[var(--foreground)]">{messages.brand.title}</p>
            {email || location ? (
              <p>
                {email ? <a href={`mailto:${email}`} className="text-[var(--foreground)] underline-offset-4 hover:underline">{email}</a> : null}
                {email && location ? <span> · </span> : null}
                {location ? <span>{location}</span> : null}
              </p>
            ) : null}
          </div>
          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </footer>
    </div>
  )
}
