import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { CmsFieldList } from '../features/cms/components/cms-field-list'
import { getAtPath, setAtPath, toSavePayload } from '../features/cms/path'
import { homeCmsSchema } from '../features/cms/schemas'

describe('cms path helpers', () => {
  it('reads and writes nested values', () => {
    const next = setAtPath({ contactInfo: { email: 'a@example.com' } }, 'contactInfo.location', 'Yangon')
    expect(getAtPath(next, 'contactInfo.email')).toBe('a@example.com')
    expect(getAtPath(next, 'contactInfo.location')).toBe('Yangon')
  })

  it('strips read-only keys from save payloads', () => {
    expect(
      toSavePayload({
        id: 'abc',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-02',
        readingTimeMinutes: 4,
        slug: 'hello',
      }),
    ).toEqual({ slug: 'hello' })
  })
})

describe('CmsFieldList', () => {
  it('edits localized translation fields through locale tabs', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [value, setValue] = useState<Record<string, unknown>>({
        featuredProjectLimit: 3,
        latestBlogLimit: 3,
        sectionVisibility: {
          hero: true,
          featuredProjects: true,
          latestPosts: true,
          skillsOverview: true,
          experienceSummary: true,
        },
        translations: {
          en: { heroTitle: 'English hero' },
          my: { heroTitle: 'Myanmar hero' },
        },
      })

      return <CmsFieldList fields={homeCmsSchema.fields} value={value} onChange={setValue} />
    }

    render(<Harness />)

    expect(screen.getByDisplayValue('English hero')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Myanmar' }))
    expect(screen.getByDisplayValue('Myanmar hero')).toBeInTheDocument()
    await user.clear(screen.getByDisplayValue('Myanmar hero'))
    await user.type(screen.getByLabelText('Hero title'), 'Updated Myanmar')
    expect(screen.getByDisplayValue('Updated Myanmar')).toBeInTheDocument()
  })
})
