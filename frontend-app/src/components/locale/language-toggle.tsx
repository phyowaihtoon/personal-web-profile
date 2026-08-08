import { useLocale } from '../../app/providers/locale-provider'
import { Button } from '../ui/button'

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
      <Button
        type="button"
        variant={locale === 'en' ? 'primary' : 'ghost'}
        className="rounded-full px-3 py-2 text-xs"
        onClick={() => setLocale('en')}
      >
        EN
      </Button>
      <Button
        type="button"
        variant={locale === 'my' ? 'primary' : 'ghost'}
        className="rounded-full px-3 py-2 text-xs"
        onClick={() => setLocale('my')}
      >
        MY
      </Button>
    </div>
  )
}