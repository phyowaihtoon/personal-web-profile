import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useLocale } from '../../app/providers/locale-provider'
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
    <div className="space-y-10">
      <PageSection title={messages.blog.title} description={messages.blog.description}>
        <label className="relative block max-w-xl">
          <span className="sr-only">{messages.blog.searchPlaceholder}</span>
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full border-0 border-b border-[var(--border)] bg-transparent py-3 pl-7 text-base outline-none transition-colors focus:border-[var(--accent)]"
            placeholder={messages.blog.searchPlaceholder}
          />
        </label>
      </PageSection>

      {postsQuery.isLoading ? <StatusView title={messages.states.loading} message={messages.states.loadingContent} /> : null}
      {postsQuery.isError ? <StatusView title={messages.states.error} message={messages.states.errorContent} /> : null}

      {postsQuery.data ? (
        <ul className="grid gap-x-10 gap-y-2 divide-y divide-[var(--border)] border-t border-[var(--border)] lg:grid-cols-2 lg:divide-y-0 lg:border-t-0">
          {postsQuery.data.map((post) => (
            <li key={post.id} className="lg:border-t lg:border-[var(--border)]">
              <Link to={`/blog/${post.slug}`} className="block py-6 transition-colors hover:text-[var(--accent)]">
                <p className="text-xs text-[var(--muted)]">
                  {post.readingTimeMinutes} {messages.blog.readingTime}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">{post.title ?? post.slug}</h3>
                {post.excerpt ? <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
