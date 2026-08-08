import { useQuery } from '@tanstack/react-query'

import { useLocale } from '../../app/providers/locale-provider'
import { Card } from '../../components/ui/card'
import { StatusView } from '../../components/ui/status-view'
import { publicApi } from '../../lib/api/public'
import { PageSection } from '../shared/page-section'

export function AboutPage() {
  const { locale, messages } = useLocale()
  const aboutQuery = useQuery({ queryKey: ['public-about', locale], queryFn: () => publicApi.getAbout(locale) })

  if (aboutQuery.isLoading) {
    return <StatusView title={messages.states.loading} message={messages.states.loadingContent} />
  }

  if (aboutQuery.isError || !aboutQuery.data) {
    return <StatusView title={messages.states.error} message={messages.states.errorContent} />
  }

  return (
    <div className="space-y-6">
      <PageSection title={messages.about.title} description={aboutQuery.data.biography}>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="bg-[var(--surface-strong)] lg:col-span-2">
            <p className="text-sm leading-7 text-[var(--muted)]">{aboutQuery.data.technicalSkillsText}</p>
          </Card>
          <Card className="bg-[var(--surface-strong)]">
            <p className="text-sm leading-7 text-[var(--muted)]">{aboutQuery.data.interestsText}</p>
          </Card>
        </div>
      </PageSection>

      <PageSection title={messages.about.timelineTitle} description={aboutQuery.data.learningJourneyText}>
        <div className="grid gap-4">
          {aboutQuery.data.careerTimeline.map((item) => (
            <Card key={`${item.startDate}-${item.title}`} className="bg-[var(--surface-strong)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                {item.startDate} {item.endDate ? `- ${item.endDate}` : '- Present'}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.subtitle}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  )
}