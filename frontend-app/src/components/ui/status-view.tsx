type Props = {
  title: string
  message: string
}

export function StatusView({ title, message }: Props) {
  return (
    <div className="px-2 py-16 text-center">
      <h2 className="display-title text-3xl text-[var(--foreground)]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{message}</p>
    </div>
  )
}
