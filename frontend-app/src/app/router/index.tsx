import { createBrowserRouter } from 'react-router-dom'

import { AdminLayout } from '../../components/layout/admin-layout'
import { PublicLayout } from '../../components/layout/public-layout'
import { GuestRoute } from '../../components/routing/guest-route'
import { ProtectedRoute } from '../../components/routing/protected-route'
import {
  aboutCmsSchema,
  categoryCmsSchema,
  experienceCmsSchema,
  homeCmsSchema,
  postCmsSchema,
  projectCmsSchema,
  settingsCmsSchema,
  skillCmsSchema,
  tagCmsSchema,
} from '../../features/cms/schemas'
import { adminApi } from '../../lib/api/admin'
import { BootstrapPage } from '../../pages/admin/bootstrap-page'
import { CmsEditorPage } from '../../pages/admin/cms-editor-page'
import { DashboardPage } from '../../pages/admin/dashboard-page'
import { LoginPage } from '../../pages/admin/login-page'
import { UploadsPage } from '../../pages/admin/uploads-page'
import { VerifyPage } from '../../pages/admin/verify-page'
import { AboutPage } from '../../pages/public/about-page'
import { BlogDetailPage } from '../../pages/public/blog-detail-page'
import { BlogListPage } from '../../pages/public/blog-list-page'
import { ExperiencePage } from '../../pages/public/experience-page'
import { HomePage } from '../../pages/public/home-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'experience', element: <ExperiencePage /> },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <BlogDetailPage /> },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      { path: '/admin/login', element: <LoginPage /> },
      { path: '/admin/bootstrap', element: <BootstrapPage /> },
    ],
  },
  {
    path: '/admin/verify',
    element: <VerifyPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: 'home',
            element: (
              <CmsEditorPage
                title="Home CMS"
                description="Hero, featured projects, latest posts, and section visibility."
                queryKey="admin-home"
                schema={homeCmsSchema}
                load={adminApi.getHome}
                mode="singleton"
                save={adminApi.updateHome}
              />
            ),
          },
          {
            path: 'about',
            element: (
              <CmsEditorPage
                title="About CMS"
                description="Biography, learning journey, and timeline content."
                queryKey="admin-about"
                schema={aboutCmsSchema}
                load={adminApi.getAbout}
                mode="singleton"
                save={adminApi.updateAbout}
              />
            ),
          },
          {
            path: 'experience',
            element: (
              <CmsEditorPage
                title="Experience"
                description="Experience entries with localized role and summary fields."
                queryKey="admin-experience"
                schema={experienceCmsSchema}
                load={adminApi.listExperience}
                mode="collection"
                create={adminApi.createExperience}
                update={adminApi.updateExperience}
                remove={adminApi.deleteExperience}
                createTemplate={{
                  company: 'New company',
                  startDate: new Date().toISOString().slice(0, 10),
                  isCurrent: false,
                  sortOrder: 0,
                  isVisible: true,
                  technologies: [],
                  featuredProjectIds: [],
                  translations: { en: { roleTitle: '', summary: '', description: '' }, my: { roleTitle: '', summary: '', description: '' } },
                }}
              />
            ),
          },
          {
            path: 'projects',
            element: (
              <CmsEditorPage
                title="Projects"
                description="Published and featured project portfolio entries."
                queryKey="admin-projects"
                schema={projectCmsSchema}
                load={adminApi.listProjects}
                mode="collection"
                create={adminApi.createProject}
                update={adminApi.updateProject}
                remove={adminApi.deleteProject}
                createTemplate={{
                  slug: 'new-project',
                  isFeatured: false,
                  isPublished: false,
                  sortOrder: 0,
                  categories: [],
                  technologies: [],
                  galleryMediaIds: [],
                  translations: { en: { title: '', summary: '', description: '' }, my: { title: '', summary: '', description: '' } },
                }}
              />
            ),
          },
          {
            path: 'skills',
            element: (
              <CmsEditorPage
                title="Skills"
                description="Skill categories, names, visibility, and ordering."
                queryKey="admin-skills"
                schema={skillCmsSchema}
                load={adminApi.listSkills}
                mode="collection"
                create={adminApi.createSkill}
                update={adminApi.updateSkill}
                remove={adminApi.deleteSkill}
                createTemplate={{
                  slug: 'new-skill',
                  categoryKey: 'general',
                  sortOrder: 0,
                  isVisible: true,
                  translations: { en: { name: '', description: '' }, my: { name: '', description: '' } },
                }}
              />
            ),
          },
          {
            path: 'blog/posts',
            element: (
              <CmsEditorPage
                title="Blog posts"
                description="Markdown posts, publish state, and SEO metadata."
                queryKey="admin-posts"
                schema={postCmsSchema}
                load={adminApi.listPosts}
                mode="collection"
                create={adminApi.createPost}
                update={adminApi.updatePost}
                remove={adminApi.deletePost}
                createTemplate={{
                  slug: 'new-post',
                  status: 'draft',
                  categoryIds: [],
                  tagIds: [],
                  translations: {
                    en: { title: '', excerpt: '', contentMarkdown: '', seoTitle: '', seoDescription: '' },
                    my: { title: '', excerpt: '', contentMarkdown: '', seoTitle: '', seoDescription: '' },
                  },
                }}
              />
            ),
          },
          {
            path: 'blog/categories',
            element: (
              <CmsEditorPage
                title="Blog categories"
                description="Canonical blog categories with localized labels."
                queryKey="admin-categories"
                schema={categoryCmsSchema}
                load={adminApi.listCategories}
                mode="collection"
                create={adminApi.createCategory}
                update={adminApi.updateCategory}
                remove={adminApi.deleteCategory}
                createTemplate={{ slug: 'new-category', translations: { en: { name: '' }, my: { name: '' } } }}
              />
            ),
          },
          {
            path: 'blog/tags',
            element: (
              <CmsEditorPage
                title="Blog tags"
                description="Tag management for public search and related posts."
                queryKey="admin-tags"
                schema={tagCmsSchema}
                load={adminApi.listTags}
                mode="collection"
                create={adminApi.createTag}
                update={adminApi.updateTag}
                remove={adminApi.deleteTag}
                createTemplate={{ slug: 'new-tag', translations: { en: { name: '' }, my: { name: '' } } }}
              />
            ),
          },
          {
            path: 'uploads',
            element: <UploadsPage />,
          },
          {
            path: 'settings',
            element: (
              <CmsEditorPage
                title="Site settings"
                description="Global site title, contact information, social links, and SEO defaults."
                queryKey="admin-settings"
                schema={settingsCmsSchema}
                load={adminApi.getSettings}
                mode="singleton"
                save={adminApi.updateSettings}
              />
            ),
          },
        ],
      },
    ],
  },
])
