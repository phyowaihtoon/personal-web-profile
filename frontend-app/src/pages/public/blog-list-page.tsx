import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useLocale } from '../../app/providers/locale-provider'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { StatusView } from '../../components/ui/status-view'
import { publicApi } from '../../lib/api/public'
import { PageSection } from '../shared/page-section'

export function BlogListPage() {
  const { locale, messages } = useLocale()
  const [query, setQuery] = useState('')
  const postsQuery = useQuery({
    queryKey: ['public-posts', locale, query],
    queryFn: () => publicApi.getBlogPosts(locale, query),
  })

  return (
    <div className="space-y-6">
      <PageSection title={messages.blog.title} description={messages.blog.description}>
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-11"
            placeholder={messages.blog.searchPlaceholder}
          />
        </div>
      </PageSection>

      {postsQuery.isLoading ? <StatusView title={messages.states.loading} message={messages.states.loadingContent} /> : null}
      {postsQuery.isError ? <StatusView title={messages.states.error} message={messages.states.errorContent} /> : null}

      {postsQuery.data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {postsQuery.data.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="h-full bg-[var(--surface-strong)] transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{post.readingTimeMinutes} min read</p>
                <h3 className="mt-3 text-xl font-semibold">{post.title ?? post.slug}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}