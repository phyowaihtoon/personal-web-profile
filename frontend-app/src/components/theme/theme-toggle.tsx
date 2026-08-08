import { MoonStar, Monitor, SunMedium } from 'lucide-react'

import { useTheme } from '../../app/providers/theme-provider'
import { Button } from '../ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const items = [
    { value: 'light' as const, label: 'Light', icon: SunMedium },
    { value: 'dark' as const, label: 'Dark', icon: MoonStar },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = theme === item.value
        return (
          <Button
            key={item.value}
            type="button"
            variant={isActive ? 'primary' : 'ghost'}
            className="h-9 w-9 rounded-full p-0"
            aria-label={`Use ${item.label} theme`}
            title={item.label}
            onClick={() => setTheme(item.value)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        )
      })}
    </div>
  )
}