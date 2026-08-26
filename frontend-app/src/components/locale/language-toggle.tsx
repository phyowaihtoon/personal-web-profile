import { useLocale } from '../../app/providers/locale-provider'
import { cn } from '../../lib/cn'

type Props = {
  variant?: 'default' | 'onDark'
}

export function LanguageToggle({ variant = 'default' }: Props) {
  const { locale, setLocale, messages } = useLocale()
  const onDark = variant === 'onDark'

  return (
    <div
      role="group"
      aria-label={messages.a11y.language}
      className={cn(
        'inline-flex items-center p-0.5',
        onDark ? 'border border-[var(--header-border)] bg-white/5' : 'border border-[var(--border)] bg-[var(--surface)]',
      )}
    >
      {(['en', 'my'] as const).map((value) => {
        const isActive = locale === value

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            className={cn(
              'rounded-sm px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-colors',
              isActive
                ? 'bg-[var(--accent)] text-white'
                : onDark
                  ? 'text-[var(--header-muted)] hover:text-[var(--header-fg)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]',
            )}
            onClick={() => setLocale(value)}
          >
            {value}
          </button>
        )
      })}
    </div>
  )
}
