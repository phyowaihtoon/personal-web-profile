import type { TextareaHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:ring-4 focus:ring-[var(--ring)]',
        className,
      )}
      {...props}
    />
  )
}