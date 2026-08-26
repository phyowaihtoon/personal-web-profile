import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

import { useLocale } from '../../app/providers/locale-provider'
import { StatusView } from '../../components/ui/status-view'
import { publicApi } from '../../lib/api/public'

export function BlogDetailPage() {
  const { slug = '' } = useParams()
  const { locale, messages } = useLocale()
  const postQuery = useQuery({ queryKey: ['public-post', slug, locale], queryFn: () => publicApi.getBlogPost(slug, locale) })

  if (postQuery.isLoading) {
    return <StatusView title={messages.states.loading} message={messages.states.loadingContent} />
  }

  if (postQuery.isError || !postQuery.data) {
    return <StatusView title={messages.states.error} message={messages.states.errorContent} />
  }

  const post = postQuery.data
  const publishedLabel = post.publishedAt
    ? new Intl.DateTimeFormat(locale === 'my' ? 'my-MM' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : null

  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">{messages.nav.blog}</p>
      <h1 className="display-title mt-4 text-4xl leading-tight sm:text-5xl">{post.title ?? post.slug}</h1>
      {post.excerpt ? <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p> : null}
      <p className="mt-5 text-sm text-[var(--muted)]">
        <span>{post.readingTimeMinutes} {messages.blog.readingTime}</span>
        {publishedLabel ? (
          <>
            <span aria-hidden="true"> · </span>
            <time dateTime={post.publishedAt ?? undefined}>{publishedLabel}</time>
          </>
        ) : null}
      </p>

      <div className="prose-markdown mt-10 border-t border-[var(--border)] pt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMarkdown ?? ''}</ReactMarkdown>
      </div>

      {post.relatedPosts.length > 0 ? (
        <section className="mt-16 border-t border-[var(--border)] pt-8">
          <h2 className="display-title text-2xl">{messages.blog.relatedPosts}</h2>
          <ul className="mt-4 space-y-4">
            {post.relatedPosts.map((related) => (
              <li key={related.id}>
                <Link to={`/blog/${related.slug}`} className="text-[var(--accent)] underline-offset-4 hover:underline">
                  {related.title ?? related.slug}
                </Link>
                {related.excerpt ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{related.excerpt}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
