import type { CmsSchema } from './types'

const emptyLocalizedPair = () => ({ en: '', my: '' })

function translationSummary(record: Record<string, unknown>, preferredKeys: string[]) {
  const translations = record.translations
  if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
    return ''
  }
  const en = (translations as Record<string, unknown>).en
  if (!en || typeof en !== 'object' || Array.isArray(en)) {
    return ''
  }
  for (const key of preferredKeys) {
    const value = (en as Record<string, unknown>)[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }
  return ''
}

export const homeCmsSchema: CmsSchema = {
  summary: () => 'Home page content',
  fields: [
    { kind: 'number', path: 'featuredProjectLimit', label: 'Featured projects limit' },
    { kind: 'number', path: 'latestBlogLimit', label: 'Latest posts limit' },
    {
      kind: 'booleanMap',
      path: 'sectionVisibility',
      label: 'Section visibility',
      keys: [
        { key: 'hero', label: 'Hero' },
        { key: 'featuredProjects', label: 'Featured projects' },
        { key: 'latestPosts', label: 'Latest posts' },
        { key: 'skillsOverview', label: 'Skills overview' },
        { key: 'experienceSummary', label: 'Experience summary' },
      ],
    },
    {
      kind: 'translationGroup',
      label: 'Localized home copy',
      fields: [
        { key: 'heroTitle', label: 'Hero title', kind: 'text' },
        { key: 'heroSubtitle', label: 'Hero subtitle', kind: 'textarea', rows: 3 },
        { key: 'introText', label: 'Intro text', kind: 'textarea', rows: 4 },
        { key: 'featuredProjectsHeading', label: 'Featured projects heading', kind: 'text' },
        { key: 'latestBlogHeading', label: 'Latest blog heading', kind: 'text' },
        { key: 'skillsOverviewText', label: 'Skills overview text', kind: 'textarea', rows: 3 },
        { key: 'experienceSummaryText', label: 'Experience summary text', kind: 'textarea', rows: 3 },
      ],
    },
  ],
}

export const aboutCmsSchema: CmsSchema = {
  summary: () => 'About page content',
  fields: [
    { kind: 'text', path: 'profileMediaId', label: 'Profile media ID', placeholder: 'Optional upload id' },
    {
      kind: 'translationGroup',
      label: 'Localized about copy',
      fields: [
        { key: 'biography', label: 'Biography', kind: 'textarea', rows: 5 },
        { key: 'technicalSkillsText', label: 'Technical skills text', kind: 'textarea', rows: 4 },
        { key: 'interestsText', label: 'Interests text', kind: 'textarea', rows: 4 },
        { key: 'learningJourneyText', label: 'Learning journey text', kind: 'textarea', rows: 4 },
      ],
    },
    {
      kind: 'objectList',
      path: 'careerTimeline',
      label: 'Career timeline',
      itemLabel: 'Timeline entry',
      createItem: () => ({
        startDate: new Date().toISOString().slice(0, 10),
        endDate: null,
        title: emptyLocalizedPair(),
        subtitle: emptyLocalizedPair(),
        description: emptyLocalizedPair(),
      }),
      fields: [
        { kind: 'date', path: 'startDate', label: 'Start date' },
        { kind: 'date', path: 'endDate', label: 'End date' },
        { kind: 'localizedString', path: 'title', label: 'Title' },
        { kind: 'localizedString', path: 'subtitle', label: 'Subtitle' },
        { kind: 'localizedTextarea', path: 'description', label: 'Description', rows: 3 },
      ],
    },
  ],
}

export const experienceCmsSchema: CmsSchema = {
  summary: (record) => String(record.company || translationSummary(record, ['roleTitle']) || 'Experience entry'),
  fields: [
    { kind: 'text', path: 'company', label: 'Company' },
    { kind: 'date', path: 'startDate', label: 'Start date' },
    { kind: 'date', path: 'endDate', label: 'End date' },
    { kind: 'boolean', path: 'isCurrent', label: 'Current role' },
    { kind: 'number', path: 'sortOrder', label: 'Sort order' },
    { kind: 'boolean', path: 'isVisible', label: 'Visible' },
    { kind: 'stringList', path: 'technologies', label: 'Technologies', hint: 'Comma-separated values' },
    { kind: 'stringList', path: 'featuredProjectIds', label: 'Featured project IDs', hint: 'Comma-separated IDs' },
    {
      kind: 'translationGroup',
      label: 'Localized role copy',
      fields: [
        { key: 'roleTitle', label: 'Role title', kind: 'text' },
        { key: 'summary', label: 'Summary', kind: 'textarea', rows: 3 },
        { key: 'description', label: 'Description', kind: 'textarea', rows: 5 },
      ],
    },
  ],
}

export const projectCmsSchema: CmsSchema = {
  summary: (record) => String(record.slug || translationSummary(record, ['title']) || 'Project'),
  fields: [
    { kind: 'text', path: 'slug', label: 'Slug' },
    { kind: 'text', path: 'githubUrl', label: 'GitHub URL', placeholder: 'https://...' },
    { kind: 'text', path: 'demoUrl', label: 'Demo URL', placeholder: 'https://...' },
    { kind: 'boolean', path: 'isFeatured', label: 'Featured' },
    { kind: 'boolean', path: 'isPublished', label: 'Published' },
    { kind: 'number', path: 'sortOrder', label: 'Sort order' },
    { kind: 'stringList', path: 'categories', label: 'Categories', hint: 'Comma-separated values' },
    { kind: 'stringList', path: 'technologies', label: 'Technologies', hint: 'Comma-separated values' },
    { kind: 'stringList', path: 'galleryMediaIds', label: 'Gallery media IDs', hint: 'Comma-separated IDs' },
    {
      kind: 'translationGroup',
      label: 'Localized project copy',
      fields: [
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'summary', label: 'Summary', kind: 'textarea', rows: 3 },
        { key: 'description', label: 'Description', kind: 'textarea', rows: 5 },
      ],
    },
  ],
}

export const skillCmsSchema: CmsSchema = {
  summary: (record) => String(record.slug || translationSummary(record, ['name']) || 'Skill'),
  fields: [
    { kind: 'text', path: 'slug', label: 'Slug' },
    { kind: 'text', path: 'categoryKey', label: 'Category key' },
    { kind: 'number', path: 'sortOrder', label: 'Sort order' },
    { kind: 'boolean', path: 'isVisible', label: 'Visible' },
    {
      kind: 'translationGroup',
      label: 'Localized skill copy',
      fields: [
        { key: 'name', label: 'Name', kind: 'text' },
        { key: 'description', label: 'Description', kind: 'textarea', rows: 3 },
      ],
    },
  ],
}

export const postCmsSchema: CmsSchema = {
  summary: (record) => String(record.slug || translationSummary(record, ['title']) || 'Blog post'),
  fields: [
    { kind: 'text', path: 'slug', label: 'Slug' },
    {
      kind: 'select',
      path: 'status',
      label: 'Status',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ],
    },
    { kind: 'text', path: 'featuredImageMediaId', label: 'Featured image media ID', placeholder: 'Optional upload id' },
    { kind: 'stringList', path: 'categoryIds', label: 'Category IDs / slugs', hint: 'Comma-separated values' },
    { kind: 'stringList', path: 'tagIds', label: 'Tag IDs / slugs', hint: 'Comma-separated values' },
    {
      kind: 'translationGroup',
      label: 'Localized post content',
      fields: [
        { key: 'title', label: 'Title', kind: 'text' },
        { key: 'excerpt', label: 'Excerpt', kind: 'textarea', rows: 3 },
        { key: 'contentMarkdown', label: 'Markdown content', kind: 'markdown' },
        { key: 'seoTitle', label: 'SEO title', kind: 'text' },
        { key: 'seoDescription', label: 'SEO description', kind: 'textarea', rows: 3 },
      ],
    },
  ],
}

export const categoryCmsSchema: CmsSchema = {
  summary: (record) => String(record.slug || translationSummary(record, ['name']) || 'Category'),
  fields: [
    { kind: 'text', path: 'slug', label: 'Slug' },
    {
      kind: 'translationGroup',
      label: 'Localized labels',
      fields: [{ key: 'name', label: 'Name', kind: 'text' }],
    },
  ],
}

export const tagCmsSchema: CmsSchema = {
  summary: (record) => String(record.slug || translationSummary(record, ['name']) || 'Tag'),
  fields: [
    { kind: 'text', path: 'slug', label: 'Slug' },
    {
      kind: 'translationGroup',
      label: 'Localized labels',
      fields: [{ key: 'name', label: 'Name', kind: 'text' }],
    },
  ],
}

export const settingsCmsSchema: CmsSchema = {
  summary: () => 'Site settings',
  fields: [
    { kind: 'localizedString', path: 'siteTitle', label: 'Site title' },
    {
      kind: 'select',
      path: 'defaultLocale',
      label: 'Default locale',
      options: [
        { value: 'en', label: 'English' },
        { value: 'my', label: 'Myanmar' },
      ],
    },
    { kind: 'localizedString', path: 'seoDefaultTitle', label: 'Default SEO title' },
    { kind: 'localizedTextarea', path: 'seoDefaultDescription', label: 'Default SEO description', rows: 3 },
    { kind: 'text', path: 'logoMediaId', label: 'Logo media ID', placeholder: 'Optional upload id' },
    { kind: 'text', path: 'faviconMediaId', label: 'Favicon media ID', placeholder: 'Optional upload id' },
    { kind: 'text', path: 'contactInfo.email', label: 'Contact email' },
    { kind: 'text', path: 'contactInfo.location', label: 'Contact location' },
    { kind: 'text', path: 'analyticsScriptIds.googleAnalytics', label: 'Google Analytics ID' },
    {
      kind: 'booleanMap',
      path: 'homepageSectionVisibility',
      label: 'Homepage section visibility',
      keys: [
        { key: 'featuredProjects', label: 'Featured projects' },
        { key: 'latestPosts', label: 'Latest posts' },
        { key: 'skillsOverview', label: 'Skills overview' },
        { key: 'experienceSummary', label: 'Experience summary' },
      ],
    },
    {
      kind: 'objectList',
      path: 'socialLinks',
      label: 'Social links',
      itemLabel: 'Social link',
      createItem: () => ({ label: '', url: '' }),
      fields: [
        { kind: 'text', path: 'label', label: 'Label' },
        { kind: 'text', path: 'url', label: 'URL', placeholder: 'https://...' },
      ],
    },
  ],
}
