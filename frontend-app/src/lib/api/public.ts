import { apiRequest } from './client'
import type {
  AboutPageData,
  BlogPostDetail,
  BlogPostSummary,
  ExperienceItem,
  HomePageData,
  SiteSettings,
  SkillItem,
} from './types'

export const publicApi = {
  getSiteSettings: () => apiRequest<SiteSettings>('/public/site-settings'),
  getHome: (lang: 'en' | 'my') => apiRequest<HomePageData>(`/public/home?lang=${lang}`),
  getAbout: (lang: 'en' | 'my') => apiRequest<AboutPageData>(`/public/about?lang=${lang}`),
  getExperience: (lang: 'en' | 'my') => apiRequest<ExperienceItem[]>(`/public/experience?lang=${lang}`),
  getSkills: (lang: 'en' | 'my') => apiRequest<SkillItem[]>(`/public/skills?lang=${lang}`),
  getBlogPosts: (lang: 'en' | 'my', query = '') =>
    apiRequest<BlogPostSummary[]>(`/public/blog/posts?lang=${lang}${query ? `&q=${encodeURIComponent(query)}` : ''}`),
  getBlogPost: (slug: string, lang: 'en' | 'my') =>
    apiRequest<BlogPostDetail>(`/public/blog/posts/${slug}?lang=${lang}`),
}