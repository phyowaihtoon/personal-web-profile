# Personal Website Project Specification

## 1. Project Overview

This project is a personal website platform with two main surfaces:

1. **Public Website**
   - Home
   - About
   - Experience
   - Blog
   - Contact/social information

2. **Admin Portal**
   - Secure admin authentication
   - Content management for all public sections
   - Blog management
   - File upload management
   - Site settings management
   - Localization management
   - Dashboard

The system is **content-driven from the backend**. Public pages must not rely on hardcoded content except for structural UI.

The platform must support:

- **English** and **Myanmar**
- **Light/Dark/System theme**
- **JWT authentication**
- **API versioning**
- **Clean modular architecture**
- **Future extensibility for multi-admin support**

## Current V1 Implementation Notes

- The current backend implementation stores localized resource variants in JSON fields per entity instead of separate translation tables. The API still resolves English/Myanmar content with English field-level fallback.
- The current admin CMS implementation provides generic JSON editors plus file upload management for all modules. Blog content is still authored as Markdown, but the V1 admin UI edits it through JSON-backed forms rather than a dedicated rich Markdown editor.
- The current frontend public shell reads site title, contact information, social links, and page content from backend APIs; navigation labels remain frontend-localized UI strings.

---

## 2. Goals

### Primary Goals

- Provide a professional personal website with structured, manageable content.
- Enable secure admin-only content management.
- Support bilingual content and UI.
- Deliver a maintainable codebase with clean separation of concerns.
- Establish a strong V1 foundation for future expansion.

### V1 Priority Order

1. Admin Authentication
2. Content Management (CMS)
3. Public Website
4. Blog System
5. Image/File Upload
6. Social links/contact information
7. Localization
8. Analytics placeholder only via settings, no active integration required

---

## 3. Scope

## In Scope for V1

### Public Website

- Home page
- About page
- Experience page
- Blog listing and blog detail pages
- Simple contact/social information display
- Language switcher
- Theme switcher
- SEO metadata support
- Responsive UI

### Admin Portal

- Bootstrap admin creation
- Login
- Access token + refresh token flow
- Token verification
- Dashboard
- Manage:
  - Home content
  - About content
  - Experience entries
  - Projects
  - Skills
  - Blog posts
  - Blog categories
  - Blog tags
  - Site settings
  - Uploaded files
- View contact/social information settings
- Localized content editing
- Draft/publish workflow for blog

### Backend/API

- Public read APIs
- Admin CRUD APIs
- Auth APIs
- File upload APIs
- API versioning under `/api/v1`

### Testing

- Frontend unit/component tests
- Backend unit tests
- Backend integration tests where practical

## Out of Scope for V1

- Public user accounts
- Comments
- Newsletter
- End-to-end tests
- Multi-role admin permissions
- Cloud media storage
- Analytics integration implementation
- Advanced search ranking
- Real-time editing or collaboration

---

## 4. Technology Stack

## Frontend

- React
- Vite
- TypeScript
- React Query
- React Router
- React Hook Form
- shadcn/ui
- Tailwind CSS
- Lucide Icons
- JWT auth integration
- English/Myanmar localization
- Light/Dark/System theme support
- Vitest for testing

## Backend

- Express
- TypeScript
- Prisma
- SQLite for local development and testing
- PostgreSQL for production
- Express Validator
- CORS
- JWT authentication
- API versioning
- Jest and Supertest for testing
- ESLint + TypeScript ESLint
- `tsx` for development watch mode

---

## 5. Users and Roles

## User Types

### Public Visitor

- Can browse all published public content
- Can switch language
- Can switch theme
- Can search blog content
- Cannot access admin features

### Admin

- Single role in V1: `admin`
- Can log in to admin portal
- Can manage all content and settings
- Can upload files
- Can create, edit, publish, unpublish, and delete blog content
- Can manage localized content
- Can view protected admin dashboard and resources

---

## 6. Authentication and Authorization

## Authentication Model

- **Access Token**
  - JWT
  - Used for authenticated API requests
  - Stored in frontend memory only

- **Refresh Token**
  - Stored in **httpOnly secure cookie**
  - Used to refresh session safely

## Admin Registration Model

- No public registration
- Initial admin account is created through **bootstrap-only flow**
- Bootstrap flow must be available only until the first admin exists
- After initial setup, further admin creation is out of scope for V1

## Required Auth Endpoints

- `POST /api/v1/auth/bootstrap` (available only when no admin exists)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/verify`

## Authorization Model

- All admin APIs require authenticated admin access
- All content management actions require admin role
- Public APIs expose only published/public-safe content

---

## 7. Public Website Functional Requirements

## 7.1 Home Page

The Home page must support:

- Hero section
- Professional introduction
- Latest blog posts (3 to 5)
- Skills overview
- Experience summary

All content must come from backend-managed CMS content.

## 7.2 About Page

The About page must support:

- Biography
- Professional photo
- Technical skills
- Career timeline
- Interests and learning journey

## 7.3 Experience Page

The Experience page must support:

- Work experience entries
- Featured projects
- Technology stack references

## 7.4 Blog

The Blog must support:

- Blog listing page
- Individual blog detail pages
- Categories
- Tags
- Simple keyword search
- Related posts
- Featured image
- Slug-based URLs
- SEO metadata
- Reading time
- Draft/published workflow on admin side
- Public exposure of published content only

## 7.5 Contact / Social Information

V1 must include:

- Social links
- Contact information display

V1 must **not** include a contact form.

## 7.6 Localization

The public website must support:

- English
- Myanmar

The language toggle must affect:

- UI labels
- Page content
- Blog content

If Myanmar content is missing, the frontend must **fallback to English**.

## 7.7 Theme

The public website must support:

- System default theme
- Light theme
- Dark theme

Theme selection must persist between visits.

---

## 8. Admin Portal Functional Requirements

## 8.1 Admin Dashboard

The dashboard should provide a simple operational overview, such as:

- Content counts
- Blog draft/published counts
- Recent blog posts
- Recent uploads
- System status summary

## 8.2 Content Management Modules

### Home Content Management

Admin can manage localized content for:

- Hero
- Intro
- Featured project selection
- Latest blog section title/content
- Skills overview content
- Experience summary content
- Section visibility

### About Management

Admin can manage localized content for:

- Biography
- Professional photo reference
- Technical skills section content
- Career timeline content
- Interests and learning journey

### Experience Management

Admin can manage:

- Experience entries
- Dates
- Titles
- Organization/company
- Descriptions
- Technologies
- Ordering
- Visibility

### Projects Management

Admin can manage:

- Project title
- Slug
- Summary
- Full description
- Categories
- Technologies
- Featured image
- Gallery/files
- GitHub URL
- Demo URL
- Featured flag
- Publish visibility

### Skills Management

Admin can manage:

- Skill names
- Categories/groups
- Ordering
- Optional description or level
- Visibility

### Blog Management

Admin can manage:

- Post title
- Slug
- Excerpt
- Content
- Canonical content format: **Markdown**
- Rich editor UI for authoring
- Featured image
- Categories
- Tags
- Draft/published state
- Published date
- SEO title
- SEO description
- Open Graph image
- Reading time
- Related post logic inputs if manually supported

### Site Settings Management

Admin can manage:

- Site title
- SEO defaults
- Logo
- Favicon
- Social links
- Contact information
- Homepage section visibility
- Analytics script IDs

### File Upload Management

Admin can upload and manage:

- Images
- Documents/files

Storage for V1:

- Local file storage

The design must allow replacement with cloud storage later.

## 8.3 Admin Localization

Localization must apply to:

- Public site
- Admin UI
- Admin-managed content

## 8.4 Validation and Error Handling

Admin actions must include:

- Request validation
- Clear field-level validation errors
- Standard API error responses
- Unauthorized handling
- Expired-session handling with refresh flow

---

## 9. Non-Functional Requirements

## 9.1 Performance

- Lighthouse score target: **90 or higher**
- Public pages should be optimized for fast load and rendering
- Images should support size-conscious rendering strategy
- Avoid unnecessary frontend bundle growth

## 9.2 SEO

Must support:

- SEO-friendly URLs
- Metadata per page/post
- Open Graph tags
- Structured Data where relevant
- `sitemap.xml`
- `robots.txt`

## 9.3 Accessibility

- Target: **WCAG 2.1 AA**
- Keyboard navigation support
- Semantic HTML
- Accessible forms
- Contrast-safe themes
- Proper labels and focus states

## 9.4 Responsiveness

Must support:

- Mobile
- Tablet
- Desktop

## 9.5 Browser Support

Support latest stable versions of:

- Chrome
- Edge
- Firefox
- Safari

## 9.6 Maintainability

- Clean modular architecture
- Shared conventions across frontend and backend
- Clear domain separation
- Reusable components/services
- Versioned API
- Environment-based configuration

## 9.7 Security

- Password hashing
- Secure JWT handling
- httpOnly secure refresh cookies
- Input validation
- Controlled CORS configuration
- Protection against invalid file uploads
- No sensitive error leakage in production

---

## 10. Content and Localization Rules

## Required Localization Behavior

All CMS-managed content must support localization for:

- English
- Myanmar

This includes:

- Home content
- About content
- Experience content
- Project content
- Blog content
- Site settings where user-facing text is shown
- Admin UI labels

## Fallback Rule

If requested Myanmar content is not available:

- Return or render English fallback content

## Slug Behavior

- Slugs should be stable and unique
- Slug strategy may remain single canonical slug per resource in V1
- UI content is localized, but routing can remain canonical by slug

---

## 11. Data Model Overview

The following is the minimum recommended conceptual model.

## 11.1 Authentication

### AdminUser

- id
- email
- passwordHash
- role
- isActive
- createdAt
- updatedAt

### RefreshSession

- id
- adminUserId
- tokenHash or session identifier
- expiresAt
- createdAt
- revokedAt
- userAgent
- ipAddress

## 11.2 Media

### MediaFile

- id
- originalName
- storedName
- mimeType
- size
- path
- kind
- uploadedBy
- createdAt

## 11.3 Site Settings

### SiteSetting

- id
- siteTitle
- defaultLocale
- seoDefaultTitle
- seoDefaultDescription
- logoMediaId
- faviconMediaId
- socialLinks
- contactInfo
- analyticsScriptIds
- homepageSectionVisibility
- createdAt
- updatedAt

## 11.4 Home Content

### HomePage

- id
- heroImageMediaId
- featuredProjectLimit
- latestBlogLimit
- createdAt
- updatedAt

### HomePageTranslation

- id
- homePageId
- locale
- heroTitle
- heroSubtitle
- introText
- skillsOverviewText
- experienceSummaryText
- latestBlogHeading
- featuredProjectsHeading

## 11.5 About Content

### AboutPage

- id
- profileMediaId
- createdAt
- updatedAt

### AboutPageTranslation

- id
- aboutPageId
- locale
- biography
- technicalSkillsText
- interestsText
- learningJourneyText

### CareerTimelineItem

- id
- aboutPageId
- order
- startDate
- endDate
- createdAt
- updatedAt

### CareerTimelineItemTranslation

- id
- careerTimelineItemId
- locale
- title
- subtitle
- description

## 11.6 Experience

### ExperienceItem

- id
- company
- startDate
- endDate
- isCurrent
- order
- isVisible
- createdAt
- updatedAt

### ExperienceItemTranslation

- id
- experienceItemId
- locale
- roleTitle
- summary
- description

### ExperienceTechnology

- id
- experienceItemId
- name
- order

## 11.7 Skills

### Skill

- id
- slug
- categoryKey
- order
- isVisible
- createdAt
- updatedAt

### SkillTranslation

- id
- skillId
- locale
- name
- description

## 11.8 Projects

### Project

- id
- slug
- featuredImageMediaId
- githubUrl
- demoUrl
- isFeatured
- isPublished
- publishedAt
- order
- createdAt
- updatedAt

### ProjectTranslation

- id
- projectId
- locale
- title
- summary
- description
- seoTitle
- seoDescription

### ProjectCategory

- id
- slug
- createdAt

### ProjectCategoryTranslation

- id
- projectCategoryId
- locale
- name

### ProjectTechnology

- id
- projectId
- name
- order

## 11.9 Blog

### BlogPost

- id
- slug
- status
- featuredImageMediaId
- readingTimeMinutes
- publishedAt
- createdAt
- updatedAt

### BlogPostTranslation

- id
- blogPostId
- locale
- title
- excerpt
- contentMarkdown
- seoTitle
- seoDescription

### BlogCategory

- id
- slug
- createdAt

### BlogCategoryTranslation

- id
- blogCategoryId
- locale
- name

### BlogTag

- id
- slug
- createdAt

### BlogTagTranslation

- id
- blogTagId
- locale
- name

### BlogPostCategory

- blogPostId
- blogCategoryId

### BlogPostTag

- blogPostId
- blogTagId

---

## 12. API Overview

Base path:

- `/api/v1`

## 12.1 Response Conventions

Recommended API response shape:

- success responses return `data`
- list responses return `data` + `meta`
- error responses return `error`

Example structure:

- `data`
- `meta`
- `error.code`
- `error.message`
- `error.details`

## 12.2 Auth APIs

- `POST /api/v1/auth/bootstrap` (bootstrap-only; disabled after first admin)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/verify`

## 12.3 Public APIs

### Site/Settings

- `GET /api/v1/public/site-settings`
- `GET /api/v1/public/navigation`
- `GET /api/v1/public/home` (includes latest blog posts)
- `GET /api/v1/public/about`
- `GET /api/v1/public/experience` (may include experience-linked featured projects)
- `GET /api/v1/public/skills`

### Blog

- `GET /api/v1/public/blog/posts`
- `GET /api/v1/public/blog/posts/:slug`
- `GET /api/v1/public/blog/categories`
- `GET /api/v1/public/blog/tags`
- `GET /api/v1/public/blog/search`

Public APIs must return only published/visible content.

## 12.4 Admin APIs

### Dashboard

- `GET /admin/dashboard`

### Home/About/Experience/Skills

- CRUD endpoints for each module
- Localized field support per resource

### Projects

- `GET /admin/projects`
- `POST /admin/projects`
- `GET /admin/projects/:id`
- `PATCH /admin/projects/:id`
- `DELETE /admin/projects/:id`

### Blog

- `GET /admin/blog/posts`
- `POST /admin/blog/posts`
- `GET /admin/blog/posts/:id`
- `PATCH /admin/blog/posts/:id`
- `DELETE /admin/blog/posts/:id`

- `GET /admin/blog/categories`
- `POST /admin/blog/categories`
- `PATCH /admin/blog/categories/:id`
- `DELETE /admin/blog/categories/:id`

- `GET /admin/blog/tags`
- `POST /admin/blog/tags`
- `PATCH /admin/blog/tags/:id`
- `DELETE /admin/blog/tags/:id`

### Files

- `POST /admin/uploads`
- `GET /admin/uploads`
- `DELETE /admin/uploads/:id`

### Settings

- `GET /admin/settings`
- `PATCH /admin/settings`

## 12.5 Query Parameters

Recommended common query support:

- `lang=en|my`
- pagination: `page`, `pageSize`
- sorting where needed
- filtering by category/tag/status
- search keyword parameter, e.g. `q`

---

## 13. UI Overview

## 13.1 Public UI

### Global Layout

- Header
- Navigation
- Language toggle
- Theme toggle
- Main content area
- Footer with social/contact information

### Public Pages

- Home
- About
- Experience
- Blog list
- Blog detail

### Public UI Requirements

- Clean professional presentation
- Strong readability
- Responsive layout
- Accessible navigation
- Good dark mode behavior
- Localized text and content fallback

## 13.2 Admin UI

### Global Layout

- Sidebar/top navigation
- Authenticated route shell
- Dashboard home
- Section-based content editors
- Media management area
- Settings area

### Admin UI Requirements

- Clear form-driven editing
- Localized input sections
- Markdown editor with rich editing experience
- Upload selection and preview
- Draft/publish controls
- Validation feedback
- Session-expiry handling

---

## 14. Workflows

## 14.1 Initial Admin Bootstrap

1. System starts with no admin user.
2. Bootstrap mechanism is enabled.
3. Initial admin account is created once.
4. Bootstrap mechanism is disabled after first admin exists.

## 14.2 Admin Login

1. Admin submits credentials.
2. Backend validates credentials.
3. Backend returns access token and sets refresh cookie.
4. Frontend stores access token in memory.
5. Admin session becomes active.

## 14.3 Session Refresh

1. Access token expires.
2. Frontend calls refresh endpoint.
3. Backend validates refresh cookie/session.
4. Backend issues new access token.
5. Frontend updates in-memory token.

## 14.4 Public Content Retrieval

1. User opens a public page.
2. Frontend requests localized content from public API.
3. Backend resolves requested locale.
4. If localized content is missing, English fallback is returned or applied.
5. Frontend renders page.

## 14.5 Blog Publishing

1. Admin creates or edits post.
2. Admin writes Markdown content through rich editor UI.
3. Admin sets category, tags, featured image, and SEO fields.
4. Admin saves as draft or publishes.
5. Published posts become visible through public APIs.

## 14.6 File Upload

1. Admin uploads image or document.
2. Backend validates file type and size.
3. File is stored locally.
4. Media metadata is stored in database.
5. Media becomes available for content association.

---

## 15. Permissions Matrix

| Resource | Public Visitor | Admin |
|---|---:|---:|
| View published home/about/experience/blog | Yes | Yes |
| View draft content | No | Yes |
| Login to admin | No | Yes |
| Manage content | No | Yes |
| Manage blog | No | Yes |
| Manage uploads | No | Yes |
| Manage settings | No | Yes |
| Access dashboard | No | Yes |

---

## 16. Architecture

## 16.1 Frontend Architecture

Recommended structure:

- `src/features/`
  - auth
  - blog
  - projects (admin CMS module; no standalone public Projects page in V1)
  - settings
  - uploads

...existing code...