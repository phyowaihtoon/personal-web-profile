import type { InputHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:ring-4 focus:ring-[var(--ring)]',
        className,
      )}
      {...props}
    />
  )
}