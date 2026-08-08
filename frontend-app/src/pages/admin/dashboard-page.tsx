import { useQuery } from '@tanstack/react-query'

import { useAuth } from '../../app/providers/auth-provider'
import { Card } from '../../components/ui/card'
import { StatusView } from '../../components/ui/status-view'
import { adminApi } from '../../lib/api/admin'

export function DashboardPage() {
  const { accessToken } = useAuth()
  const dashboardQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(accessToken ?? ''),
  })

  if (dashboardQuery.isLoading) {
    return <StatusView title="Loading dashboard" message="Collecting recent activity and content totals." />
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <StatusView title="Unable to load dashboard" message="Check the API connection and session state." />
  }

  const { counts, blogStatus, recentPosts, recentUploads } = dashboardQuery.data

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Dashboard</p>
        <h1 className="display-title mt-3 text-4xl">Operational overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(counts).map(([label, value]) => (
          <Card key={label} className="bg-[var(--surface-strong)]">
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-4 text-4xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="bg-[var(--surface-strong)]">
          <h2 className="text-xl font-semibold">Blog status</h2>
          <p className="mt-4 text-sm text-[var(--muted)]">Draft: {blogStatus.draft}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Published: {blogStatus.published}</p>
        </Card>

        <Card className="bg-[var(--surface-strong)]">
          <h2 className="text-xl font-semibold">Recent uploads</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            {recentUploads.map((upload) => (
              <div key={upload.id} className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3">
                {upload.originalName} · {upload.kind}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-[var(--surface-strong)]">
        <h2 className="text-xl font-semibold">Recent posts</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {recentPosts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-[var(--border)] px-4 py-3">
              <h3 className="font-semibold">{post.title ?? post.slug}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}