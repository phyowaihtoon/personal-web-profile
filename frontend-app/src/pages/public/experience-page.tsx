import { useQueries } from '@tanstack/react-query'

import { useLocale } from '../../app/providers/locale-provider'
import { Card } from '../../components/ui/card'
import { StatusView } from '../../components/ui/status-view'
import { publicApi } from '../../lib/api/public'
import { PageSection } from '../shared/page-section'

export function ExperiencePage() {
  const { locale, messages } = useLocale()
  const [experienceQuery, skillsQuery] = useQueries({
    queries: [
      { queryKey: ['public-experience', locale], queryFn: () => publicApi.getExperience(locale) },
      { queryKey: ['public-skills', locale], queryFn: () => publicApi.getSkills(locale) },
    ],
  })

  if (experienceQuery.isLoading || skillsQuery.isLoading) {
    return <StatusView title={messages.states.loading} message={messages.states.loadingContent} />
  }

  if (experienceQuery.isError || skillsQuery.isError || !experienceQuery.data || !skillsQuery.data) {
    return <StatusView title={messages.states.error} message={messages.states.errorContent} />
  }

  return (
    <div className="space-y-6">
      <PageSection title={messages.experience.title}>
        <div className="grid gap-4">
          {experienceQuery.data.map((item) => (
            <Card key={item.id} className="bg-[var(--surface-strong)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{item.roleTitle}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.company}</p>
                </div>
                <p className="text-sm text-[var(--accent)]">
                  {item.startDate} {item.endDate ? `- ${item.endDate}` : '- Present'}
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.description ?? item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span key={tech} className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection title={messages.experience.skillsTitle}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillsQuery.data.map((skill) => (
            <Card key={skill.id} className="bg-[var(--surface-strong)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{skill.categoryKey}</p>
              <h3 className="mt-2 text-lg font-semibold">{skill.name ?? skill.slug}</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{skill.description}</p>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  )
}