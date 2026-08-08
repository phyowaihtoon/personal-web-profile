type Props = {
  title: string
  message: string
}

export function StatusView({ title, message }: Props) {
  return (
    <div className="glass-panel rounded-[1.5rem] p-10 text-center">
      <h2 className="display-title text-3xl text-[var(--foreground)]">{title}</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
    </div>
  )
}