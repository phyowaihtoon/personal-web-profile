import type { ReactNode } from 'react'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}

export function PageSection({ eyebrow, title, description, children }: Props) {
  return (
    <section className="space-y-5">
      <header className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p>
        ) : null}
        <h2 className="display-title text-3xl text-[var(--foreground)] sm:text-4xl">{title}</h2>
        {description ? <p className="text-base leading-7 text-[var(--muted)]">{description}</p> : null}
      </header>
      {children ? <div>{children}</div> : null}
    </section>
  )
}
