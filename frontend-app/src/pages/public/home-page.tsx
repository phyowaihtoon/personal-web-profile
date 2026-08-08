import { useQuery } from '@tanstack/react-query'

import { useLocale } from '../../app/providers/locale-provider'
import { Card } from '../../components/ui/card'
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
    <div className="space-y-6">
      <PageSection
        title={hero?.heroTitle ?? messages.home.fallbackTitle}
        description={hero?.heroSubtitle ?? messages.home.fallbackSubtitle}
      >
        <div className="grid gap-6">
          <Card className="rounded-[2rem] bg-[var(--surface-strong)]">
            <p className="text-sm leading-7 text-[var(--muted)]">{hero?.introText ?? messages.home.fallbackIntro}</p>
          </Card>
          {showSkillsOverview ? (
            <Card className="rounded-[2rem] bg-[linear-gradient(135deg,var(--accent-soft),transparent)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{messages.home.skillsTitle}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{hero?.skillsOverviewText ?? messages.home.skillsOverview}</p>
            </Card>
          ) : null}
        </div>
      </PageSection>

      <div className="grid gap-6">
        {showLatestPosts ? (
          <PageSection title={hero?.latestBlogHeading ?? messages.home.latestPosts}>
            <div className="grid gap-4">
              {latestPosts.map((post) => (
                <Card key={post.id} className="rounded-[1.5rem] bg-[var(--surface-strong)]">
                  <h3 className="text-lg font-semibold">{post.title ?? post.slug}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
                </Card>
              ))}
            </div>
          </PageSection>
        ) : null}
      </div>
    </div>
  )
}