import { useQueries } from '@tanstack/react-query'

import { useLocale } from '../../app/providers/locale-provider'
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

  const skillsByCategory = skillsQuery.data.reduce<Record<string, typeof skillsQuery.data>>((groups, skill) => {
    const key = skill.categoryKey || 'general'
    groups[key] = [...(groups[key] ?? []), skill]
    return groups
  }, {})

  return (
    <div className="space-y-16">
      <PageSection title={messages.experience.title}>
        <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {experienceQuery.data.map((item) => (
            <li key={item.id} className="grid gap-4 py-8 lg:grid-cols-[10rem_1fr]">
              <p className="text-sm text-[var(--muted)]">
                {item.startDate} – {item.endDate ?? messages.experience.present}
              </p>
              <div>
                <h3 className="text-xl font-semibold">{item.roleTitle}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.company}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.description ?? item.summary}</p>
                {item.technologies.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection title={messages.experience.skillsTitle}>
        <div className="space-y-10">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">{category}</h3>
              <ul className="mt-4 grid gap-6 sm:grid-cols-2">
                {skills.map((skill) => (
                  <li key={skill.id}>
                    <h4 className="font-semibold">{skill.name ?? skill.slug}</h4>
                    {skill.description ? <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{skill.description}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
