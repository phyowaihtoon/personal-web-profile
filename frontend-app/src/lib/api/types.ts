export type LocalizedFields<T> = {
  en?: T
  my?: T
}

export type SiteSettings = {
  siteTitle?: LocalizedFields<string>
  defaultLocale: 'en' | 'my'
  seoDefaultTitle?: LocalizedFields<string>
  seoDefaultDescription?: LocalizedFields<string>
  socialLinks?: Array<{ label: string; url: string }>
  contactInfo?: { email?: string; location?: string }
  analyticsScriptIds?: { googleAnalytics?: string }
  homepageSectionVisibility?: Record<string, boolean>
}

export type HomePageData = {
  hero?: {
    heroTitle?: string
    heroSubtitle?: string
    introText?: string
    latestBlogHeading?: string
    featuredProjectsHeading?: string
    skillsOverviewText?: string
    experienceSummaryText?: string
  }
  featuredProjects: Project[]
  latestPosts: BlogPostSummary[]
  homepageSectionVisibility?: Record<string, boolean>
}

export type AboutPageData = {
  biography?: string
  technicalSkillsText?: string
  interestsText?: string
  learningJourneyText?: string
  careerTimeline: Array<{
    startDate: string
    endDate: string | null
    title: string
    subtitle: string
    description: string
  }>
}

export type ExperienceItem = {
  id: string
  company: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  sortOrder: number
  roleTitle?: string
  summary?: string
  description?: string
  technologies: string[]
}

export type SkillItem = {
  id: string
  slug: string
  categoryKey: string
  sortOrder: number
  isVisible: boolean
  name?: string
  description?: string
}

export type Project = {
  id: string
  slug: string
  githubUrl?: string | null
  demoUrl?: string | null
  isFeatured: boolean
  isPublished: boolean
  publishedAt?: string | null
  sortOrder: number
  title?: string
  summary?: string
  description?: string
  categories: string[]
  technologies: string[]
}

export type BlogPostSummary = {
  id: string
  slug: string
  title?: string
  excerpt?: string
  seoTitle?: string
  seoDescription?: string
  readingTimeMinutes: number
  publishedAt?: string | null
  categories: string[]
  tags: string[]
}

export type BlogPostDetail = BlogPostSummary & {
  contentMarkdown?: string
  relatedPosts: BlogPostSummary[]
}

export type DashboardData = {
  counts: {
    experience: number
    projects: number
    skills: number
    posts: number
    categories: number
    tags: number
    uploads: number
  }
  blogStatus: {
    draft: number
    published: number
  }
  recentPosts: BlogPostSummary[]
  recentUploads: Array<{ id: string; originalName: string; kind: string; createdAt: string }>
}