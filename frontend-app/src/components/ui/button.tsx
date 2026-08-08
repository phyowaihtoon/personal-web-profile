import type { ButtonHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-4',
        variant === 'primary' &&
          'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] focus:ring-[var(--ring)]',
        variant === 'secondary' &&
          'border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-strong)] focus:ring-[var(--ring)]',
        variant === 'ghost' && 'text-[var(--foreground)] hover:bg-[var(--accent-soft)] focus:ring-[var(--ring)]',
        className,
      )}
      {...props}
    />
  )
}