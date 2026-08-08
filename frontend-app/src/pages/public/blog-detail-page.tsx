import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

import { useLocale } from '../../app/providers/locale-provider'
import { Card } from '../../components/ui/card'
import { StatusView } from '../../components/ui/status-view'
import { publicApi } from '../../lib/api/public'
import { PageSection } from '../shared/page-section'

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

  return (
    <div className="space-y-6">
      <PageSection eyebrow={messages.nav.blog} title={post.title ?? post.slug} description={post.excerpt}>
        <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
          <span>{post.readingTimeMinutes} min read</span>
          <span>{post.publishedAt ?? 'Draft preview'}</span>
        </div>
      </PageSection>

      <Card className="bg-[var(--surface-strong)]">
        <div className="prose-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMarkdown ?? ''}</ReactMarkdown>
        </div>
      </Card>

      <PageSection title={messages.blog.relatedPosts}>
        <div className="grid gap-4 lg:grid-cols-3">
          {post.relatedPosts.map((related) => (
            <Link key={related.id} to={`/blog/${related.slug}`}>
              <Card className="h-full bg-[var(--surface-strong)]">
                <h3 className="text-lg font-semibold">{related.title ?? related.slug}</h3>
                <p className="mt-3 text-sm text-[var(--muted)]">{related.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      </PageSection>
    </div>
  )
}