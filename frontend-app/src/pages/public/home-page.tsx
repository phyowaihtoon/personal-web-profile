import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { useLocale } from '../../app/providers/locale-provider'
import { StatusView } from '../../components/ui/status-view'
import { publicApi } from '../../lib/api/public'
import { PageSection } from '../shared/page-section'

export function HomePage() {
  const { locale, messages } = useLocale()
  const homeQuery = useQuery({ queryKey: ['public-home', locale], queryFn: () => publicApi.getHome(locale) })

  if (homeQuery.isLoading) {
    return <StatusView title={messages.states.loading} message={messages.states.loadingContent} />
  }

  if (homeQuery.isError || !homeQuery.data) {
    return <StatusView title={messages.states.error} message={messages.states.errorContent} />
  }

  const { hero, latestPosts } = homeQuery.data
  const visibility = homeQuery.data.homepageSectionVisibility ?? {}
  const showSkillsOverview = visibility.skillsOverview !== false
  const showLatestPosts = visibility.latestPosts !== false

  return (
    <div className="space-y-16">
      <section className="max-w-3xl">
        <h1 className="display-title text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
          {hero?.heroTitle ?? messages.home.fallbackTitle}
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          {hero?.heroSubtitle ?? messages.home.fallbackSubtitle}
        </p>
        <p className="mt-6 text-base leading-8 text-[var(--foreground)]">
          {hero?.introText ?? messages.home.fallbackIntro}
        </p>
      </section>

      {showSkillsOverview ? (
        <PageSection title={messages.home.skillsTitle}>
          <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
            {hero?.skillsOverviewText ?? messages.home.skillsOverview}
          </p>
        </PageSection>
      ) : null}

      {showLatestPosts ? (
        <PageSection title={hero?.latestBlogHeading ?? messages.home.latestPosts}>
          {latestPosts.length === 0 ? null : (
            <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <Link to={`/blog/${post.slug}`} className="block py-5 transition-colors hover:text-[var(--accent)]">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">{post.title ?? post.slug}</h3>
                      <span className="text-xs text-[var(--muted)]">
                        {post.readingTimeMinutes} {messages.home.readingTime}
                      </span>
                    </div>
                    {post.excerpt ? <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p> : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PageSection>
      ) : null}
    </div>
  )
}
