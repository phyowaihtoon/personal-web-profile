import 'dotenv/config'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: 'site-settings' },
    update: {},
    create: {
      id: 'site-settings',
      siteTitle: { en: 'Personal Website', my: 'ကိုယ်ပိုင်ဝဘ်ဆိုက်' },
      seoDefaultTitle: { en: 'Personal Website', my: 'ကိုယ်ပိုင်ဝဘ်ဆိုက်' },
      seoDefaultDescription: {
        en: 'Content-driven personal website platform',
        my: 'အကြောင်းအရာအခြေပြု ကိုယ်ပိုင်ဝဘ်ဆိုက်စနစ်',
      },
      socialLinks: [
        { label: 'GitHub', url: 'https://github.com/' },
        { label: 'LinkedIn', url: 'https://linkedin.com/' },
      ],
      contactInfo: {
        email: 'hello@example.com',
        location: 'Yangon, Myanmar',
      },
      homepageSectionVisibility: {
        featuredProjects: true,
        latestPosts: true,
        skillsOverview: true,
        experienceSummary: true,
      },
    },
  })

  await prisma.homePage.upsert({
    where: { id: 'home-page' },
    update: {},
    create: {
      id: 'home-page',
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
        en: {
          heroTitle: 'Building clear, maintainable web systems.',
          heroSubtitle: 'A content-driven personal platform for work, writing, and growth.',
          introText: 'This starter includes public content, admin editing, and bilingual support.',
          skillsOverviewText: 'Skills and technologies managed from the backend.',
          experienceSummaryText: 'Experience highlights with visible projects and stack references.',
          latestBlogHeading: 'Latest writing',
          featuredProjectsHeading: 'Featured projects',
        },
        my: {
          heroTitle: 'ရှင်းလင်းပြီး ထိန်းသိမ်းရလွယ်ကူသော ဝဘ်စနစ်များကို တည်ဆောက်သည်။',
          heroSubtitle: 'အလုပ်အတွေ့အကြုံ၊ ဆောင်းပါးရေးသားမှု နှင့် တိုးတက်မှုအတွက် အကြောင်းအရာအခြေပြု စနစ်။',
          introText: 'ဤစနစ်တွင် public content, admin editing နှင့် ဘာသာစကားနှစ်မျိုးထောက်ပံ့မှု ပါဝင်သည်။',
          skillsOverviewText: 'Backend မှ စီမံနိုင်သော skills နှင့် technologies များ။',
          experienceSummaryText: 'အတွေ့အကြုံနှင့် project highlights များကို ပြသသည်။',
          latestBlogHeading: 'နောက်ဆုံးရေးသားချက်များ',
          featuredProjectsHeading: 'ရွေးချယ်ထားသော projects',
        },
      },
    },
  })

  await prisma.aboutPage.upsert({
    where: { id: 'about-page' },
    update: {},
    create: {
      id: 'about-page',
      translations: {
        en: {
          biography: 'Add your biography from the admin portal.',
          technicalSkillsText: 'Summarize your core technologies and strengths here.',
          interestsText: 'Describe your professional interests and goals.',
          learningJourneyText: 'Capture current learning focus areas.',
        },
        my: {
          biography: 'Admin portal မှ သင့်ရဲ့ biography ကို ဖြည့်နိုင်ပါသည်။',
          technicalSkillsText: 'အဓိက technologies နှင့် strengths ကို ဤနေရာတွင် ဖော်ပြပါ။',
          interestsText: 'ပရော်ဖက်ရှင်နယ် စိတ်ဝင်စားမှုများကို ဖော်ပြပါ။',
          learningJourneyText: 'လေ့လာနေသောအရာများကို မှတ်တမ်းတင်ပါ။',
        },
      },
      careerTimeline: [
        {
          startDate: '2024-01-01',
          endDate: null,
          title: { en: 'Platform initialization', my: 'Platform စတင်တည်ဆောက်ခြင်း' },
          subtitle: { en: 'Personal website V1', my: 'Personal website V1' },
          description: {
            en: 'The initial timeline entry can be edited from the admin portal.',
            my: 'ဤ timeline entry ကို admin portal မှ ပြင်ဆင်နိုင်သည်။',
          },
        },
      ],
    },
  })

  const category = await prisma.blogCategory.upsert({
    where: { slug: 'engineering' },
    update: {
      translations: { en: { name: 'Engineering' }, my: { name: 'အင်ဂျင်နီယာ' } },
    },
    create: {
      slug: 'engineering',
      translations: { en: { name: 'Engineering' }, my: { name: 'အင်ဂျင်နီယာ' } },
    },
  })

  const tag = await prisma.blogTag.upsert({
    where: { slug: 'typescript' },
    update: {
      translations: { en: { name: 'TypeScript' }, my: { name: 'TypeScript' } },
    },
    create: {
      slug: 'typescript',
      translations: { en: { name: 'TypeScript' }, my: { name: 'TypeScript' } },
    },
  })

  await prisma.skill.upsert({
    where: { slug: 'typescript' },
    update: {
      categoryKey: 'frontend',
      sortOrder: 1,
      translations: {
        en: { name: 'TypeScript', description: 'Type-safe application development across frontend and backend.' },
        my: { name: 'TypeScript', description: 'Frontend နှင့် backend တွင် type-safe development အတွက် အသုံးပြုသည်။' },
      },
    },
    create: {
      slug: 'typescript',
      categoryKey: 'frontend',
      sortOrder: 1,
      translations: {
        en: { name: 'TypeScript', description: 'Type-safe application development across frontend and backend.' },
        my: { name: 'TypeScript', description: 'Frontend နှင့် backend တွင် type-safe development အတွက် အသုံးပြုသည်။' },
      },
    },
  })

  await prisma.experienceItem.create({
    data: {
      company: 'Personal Platform Lab',
      startDate: new Date('2024-01-01'),
      isCurrent: true,
      sortOrder: 1,
      translations: {
        en: {
          roleTitle: 'Full-stack builder',
          summary: 'Designing a modular content platform.',
          description: 'Building public website experiences with an admin CMS and bilingual content workflow.',
        },
        my: {
          roleTitle: 'Full-stack builder',
          summary: 'Modular content platform တစ်ခုကို တည်ဆောက်နေသည်။',
          description: 'Public website နှင့် admin CMS ကို bilingual workflow ဖြင့် တည်ဆောက်နေသည်။',
        },
      },
      technologies: ['React', 'TypeScript', 'Express', 'Prisma'],
      featuredProjectIds: [],
    },
  }).catch(() => undefined)

  await prisma.project.upsert({
    where: { slug: 'personal-website-platform' },
    update: {
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
      sortOrder: 1,
      categories: ['portfolio', 'cms'],
      technologies: ['React', 'Express', 'Prisma'],
      translations: {
        en: {
          title: 'Personal Website Platform',
          summary: 'A content-driven portfolio and writing platform.',
          description: 'Includes a public site, admin portal, authentication, localization, and blog publishing.',
        },
        my: {
          title: 'Personal Website Platform',
          summary: 'Content-driven portfolio နှင့် writing platform.',
          description: 'Public site, admin portal, authentication, localization နှင့် blog publishing ပါဝင်သည်။',
        },
      },
    },
    create: {
      slug: 'personal-website-platform',
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
      sortOrder: 1,
      categories: ['portfolio', 'cms'],
      technologies: ['React', 'Express', 'Prisma'],
      translations: {
        en: {
          title: 'Personal Website Platform',
          summary: 'A content-driven portfolio and writing platform.',
          description: 'Includes a public site, admin portal, authentication, localization, and blog publishing.',
        },
        my: {
          title: 'Personal Website Platform',
          summary: 'Content-driven portfolio နှင့် writing platform.',
          description: 'Public site, admin portal, authentication, localization နှင့် blog publishing ပါဝင်သည်။',
        },
      },
    },
  })

  await prisma.blogPost.upsert({
    where: { slug: 'building-a-content-driven-personal-website' },
    update: {
      status: 'published',
      publishedAt: new Date(),
      readingTimeMinutes: 3,
      categoryIds: [category.slug],
      tagIds: [tag.slug],
      translations: {
        en: {
          title: 'Building a content-driven personal website',
          excerpt: 'Why this platform starts with CMS structure, localization, and admin workflows.',
          contentMarkdown: '# Building a content-driven personal website\n\nThis post explains the V1 platform goals and architecture.',
          seoTitle: 'Building a content-driven personal website',
          seoDescription: 'Architecture notes for a modular personal website platform.',
        },
        my: {
          title: 'Content-driven personal website တည်ဆောက်ခြင်း',
          excerpt: 'CMS structure, localization နှင့် admin workflows ကို အဘယ်ကြောင့် ပထမဦးစွာ တည်ဆောက်သနည်း။',
          contentMarkdown: '# Content-driven personal website တည်ဆောက်ခြင်း\n\nဤ post သည် V1 platform architecture ကိုရှင်းပြသည်။',
          seoTitle: 'Content-driven personal website တည်ဆောက်ခြင်း',
          seoDescription: 'Modular personal website platform အတွက် architecture notes များ။',
        },
      },
    },
    create: {
      slug: 'building-a-content-driven-personal-website',
      status: 'published',
      publishedAt: new Date(),
      readingTimeMinutes: 3,
      categoryIds: [category.slug],
      tagIds: [tag.slug],
      translations: {
        en: {
          title: 'Building a content-driven personal website',
          excerpt: 'Why this platform starts with CMS structure, localization, and admin workflows.',
          contentMarkdown: '# Building a content-driven personal website\n\nThis post explains the V1 platform goals and architecture.',
          seoTitle: 'Building a content-driven personal website',
          seoDescription: 'Architecture notes for a modular personal website platform.',
        },
        my: {
          title: 'Content-driven personal website တည်ဆောက်ခြင်း',
          excerpt: 'CMS structure, localization နှင့် admin workflows ကို အဘယ်ကြောင့် ပထမဦးစွာ တည်ဆောက်သနည်း။',
          contentMarkdown: '# Content-driven personal website တည်ဆောက်ခြင်း\n\nဤ post သည် V1 platform architecture ကိုရှင်းပြသည်။',
          seoTitle: 'Content-driven personal website တည်ဆောက်ခြင်း',
          seoDescription: 'Modular personal website platform အတွက် architecture notes များ။',
        },
      },
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })