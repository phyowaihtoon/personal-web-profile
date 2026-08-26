import type { ButtonHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150',
        variant === 'primary' &&
          'bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]',
        variant === 'secondary' &&
          'border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--accent-soft)]',
        variant === 'ghost' && 'text-[var(--foreground)] hover:bg-[var(--accent-soft)]',
        className,
      )}
      {...props}
    />
  )
}
