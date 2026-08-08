import type { ReactNode } from 'react'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}

export function PageSection({ eyebrow, title, description, children }: Props) {
  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">{eyebrow}</p> : null}
      <h2 className="display-title mt-3 text-3xl text-[var(--foreground)] sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-sm text-[var(--muted)]">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}