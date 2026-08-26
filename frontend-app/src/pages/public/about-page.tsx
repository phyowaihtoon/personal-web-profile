import { useQuery } from '@tanstack/react-query'

import { useLocale } from '../../app/providers/locale-provider'
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

  const about = aboutQuery.data

  return (
    <div className="space-y-16">
      <section className="max-w-3xl">
        <h1 className="display-title text-4xl sm:text-5xl">{messages.about.title}</h1>
        {about.biography ? <p className="mt-5 text-base leading-8 text-[var(--foreground)]">{about.biography}</p> : null}
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">{messages.about.skills}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{about.technicalSkillsText}</p>
          </div>
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">{messages.about.interests}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{about.interestsText}</p>
          </div>
        </div>
      </section>

      <PageSection title={messages.about.timelineTitle} description={about.learningJourneyText}>
        <ol className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {about.careerTimeline.map((item) => (
            <li key={`${item.startDate}-${item.title}`} className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr]">
              <p className="text-sm text-[var(--muted)]">
                {item.startDate} – {item.endDate ?? messages.experience.present}
              </p>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.subtitle ? <p className="mt-1 text-sm text-[var(--muted)]">{item.subtitle}</p> : null}
                {item.description ? <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </PageSection>
    </div>
  )
}
