import dotenv from 'dotenv'

import { PrismaClient } from '@prisma/client'

import { applyDatabaseEnv } from '../src/config/database-target'

dotenv.config()
const database = applyDatabaseEnv()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: database.databaseUrl,
    },
  },
})

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

  const homeTranslations = {
    en: {
      heroTitle: 'Senior Software Engineer | Core Banking Specialist',
      heroSubtitle: 'Building secure, scalable software solutions for modern banking and financial systems.',
      introText:
        'I’m a Senior Software Engineer with a strong focus on banking and financial technology. I design and develop reliable, scalable software across conventional core banking and Islamic banking systems.\n\nMy work combines hands-on software engineering with deep understanding of banking processes, enabling me to build solutions that are not only technically robust but also aligned with real-world financial operations.',
      skillsOverviewText:
        'My technical expertise spans backend, frontend, databases, cloud, and DevOps technologies. I work primarily with C#, Java, SQL, JavaScript, and TypeScript, using platforms and frameworks such as .NET, Spring Boot, Angular, React, and Node.js/Express.\n\nI also have experience with SQL Server, Oracle, and MySQL, along with modern development and deployment practices using Git, Docker, Kubernetes, GitLab CI/CD, and AWS. Beyond technology, my key domain expertise includes Core Banking, Islamic Banking, and EOD processing.',
      experienceSummaryText:
        'Since 2022, I have been working as a Senior Software Engineer at Consolsys Sdn. Bhd., contributing to the development and enhancement of enterprise banking and financial solutions.\n\nMy experience includes working on systems and modules such as Islamic Core Banking, ATM Gateway, EOD Framework, and Reporting Engine. These projects have given me the opportunity to work across complex financial workflows, system integrations, business-critical processing, and large-scale enterprise applications.\n\nI enjoy solving complex technical and business problems and turning them into maintainable, reliable software that can support the demanding requirements of modern banking institutions.',
      latestBlogHeading: 'Latest writing',
      featuredProjectsHeading: 'Featured projects',
    },
    my: {
      heroTitle: 'Senior Software Engineer | Core Banking Specialist',
      heroSubtitle: 'Building secure, scalable software solutions for modern banking and financial systems.',
      introText:
        'I’m a Senior Software Engineer with a strong focus on banking and financial technology. I design and develop reliable, scalable software across conventional core banking and Islamic banking systems.\n\nMy work combines hands-on software engineering with deep understanding of banking processes, enabling me to build solutions that are not only technically robust but also aligned with real-world financial operations.',
      skillsOverviewText:
        'My technical expertise spans backend, frontend, databases, cloud, and DevOps technologies. I work primarily with C#, Java, SQL, JavaScript, and TypeScript, using platforms and frameworks such as .NET, Spring Boot, Angular, React, and Node.js/Express.\n\nI also have experience with SQL Server, Oracle, and MySQL, along with modern development and deployment practices using Git, Docker, Kubernetes, GitLab CI/CD, and AWS. Beyond technology, my key domain expertise includes Core Banking, Islamic Banking, and EOD processing.',
      experienceSummaryText:
        'Since 2022, I have been working as a Senior Software Engineer at Consolsys Sdn. Bhd., contributing to the development and enhancement of enterprise banking and financial solutions.\n\nMy experience includes working on systems and modules such as Islamic Core Banking, ATM Gateway, EOD Framework, and Reporting Engine. These projects have given me the opportunity to work across complex financial workflows, system integrations, business-critical processing, and large-scale enterprise applications.\n\nI enjoy solving complex technical and business problems and turning them into maintainable, reliable software that can support the demanding requirements of modern banking institutions.',
      latestBlogHeading: 'နောက်ဆုံးရေးသားချက်များ',
      featuredProjectsHeading: 'ရွေးချယ်ထားသော projects',
    },
  }

  await prisma.homePage.upsert({
    where: { id: 'home-page' },
    update: {
      featuredProjectLimit: 3,
      latestBlogLimit: 3,
      sectionVisibility: {
        hero: true,
        featuredProjects: true,
        latestPosts: true,
        skillsOverview: true,
        experienceSummary: true,
      },
      translations: homeTranslations,
    },
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
      translations: homeTranslations,
    },
  })

  const aboutTranslations = {
    en: {
      biography:
        'I’m a Senior Software Engineer passionate about building reliable, scalable software for the banking and financial technology industry.\n\nWith strong experience in core banking and enterprise systems, I enjoy solving complex problems where technology meets real-world business requirements.\n\nI value clean architecture, maintainable code, thoughtful engineering, and solutions built to perform reliably in production. My goal is to keep growing as an engineer while creating meaningful software that delivers real value to people and organizations.',
      technicalSkillsText:
        'My expertise spans backend and frontend development, databases, system integration, cloud technologies, and DevOps practices. I have worked across Core Banking, Islamic Banking, EOD processing, and banking system integration.',
      interestsText:
        'Beyond writing code, I enjoy understanding how systems and business processes work together, and finding practical ways to turn complex financial workflows into maintainable software.',
      learningJourneyText:
        'I continuously learn new technologies and better engineering approaches so I can design systems that stay clear, resilient, and effective in production.',
    },
    my: {
      biography:
        'I’m a Senior Software Engineer passionate about building reliable, scalable software for the banking and financial technology industry.\n\nWith strong experience in core banking and enterprise systems, I enjoy solving complex problems where technology meets real-world business requirements.\n\nI value clean architecture, maintainable code, thoughtful engineering, and solutions built to perform reliably in production. My goal is to keep growing as an engineer while creating meaningful software that delivers real value to people and organizations.',
      technicalSkillsText:
        'My expertise spans backend and frontend development, databases, system integration, cloud technologies, and DevOps practices. I have worked across Core Banking, Islamic Banking, EOD processing, and banking system integration.',
      interestsText:
        'Beyond writing code, I enjoy understanding how systems and business processes work together, and finding practical ways to turn complex financial workflows into maintainable software.',
      learningJourneyText:
        'I continuously learn new technologies and better engineering approaches so I can design systems that stay clear, resilient, and effective in production.',
    },
  }

  const aboutCareerTimeline = [
    {
      startDate: '2021-12-01',
      endDate: null,
      title: { en: 'Team Leader', my: 'Team Leader' },
      subtitle: { en: 'ACE Data Systems Ltd.', my: 'ACE Data Systems Ltd.' },
      description: {
        en: 'Leading CBMMIS delivery and integration between financial institutions and the Central Bank of Myanmar.',
        my: 'Leading CBMMIS delivery and integration between financial institutions and the Central Bank of Myanmar.',
      },
    },
    {
      startDate: '2017-05-01',
      endDate: '2021-11-30',
      title: { en: 'Software Engineer', my: 'Software Engineer' },
      subtitle: { en: 'ACE Data Systems Ltd.', my: 'ACE Data Systems Ltd.' },
      description: {
        en: 'Built Internet Banking integrations, Finacle regulatory reporting, and core banking data migration solutions.',
        my: 'Built Internet Banking integrations, Finacle regulatory reporting, and core banking data migration solutions.',
      },
    },
    {
      startDate: '2013-09-01',
      endDate: '2016-11-30',
      title: { en: 'Senior Java Developer', my: 'Senior Java Developer' },
      subtitle: { en: 'Myanmar Information Technology', my: 'Myanmar Information Technology' },
      description: {
        en: 'Delivered hospital systems including Electronic Medical Records and Queue Management applications.',
        my: 'Delivered hospital systems including Electronic Medical Records and Queue Management applications.',
      },
    },
  ]

  await prisma.aboutPage.upsert({
    where: { id: 'about-page' },
    update: {
      translations: aboutTranslations,
      careerTimeline: aboutCareerTimeline,
    },
    create: {
      id: 'about-page',
      translations: aboutTranslations,
      careerTimeline: aboutCareerTimeline,
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

  type SkillSeed = {
    slug: string
    categoryKey: string
    sortOrder: number
    name: string
    description: string
    nameMy?: string
    descriptionMy?: string
  }

  const skillSeeds: SkillSeed[] = [
    { slug: 'java', categoryKey: 'backend', sortOrder: 1, name: 'Java', description: 'Enterprise application development for banking and business systems.' },
    { slug: 'csharp', categoryKey: 'backend', sortOrder: 2, name: 'C#', description: 'Building and maintaining .NET-oriented backend services and integrations.' },
    { slug: 'jsp', categoryKey: 'backend', sortOrder: 3, name: 'JSP', description: 'Server-side Java web views for enterprise applications.' },
    { slug: 'servlet', categoryKey: 'backend', sortOrder: 4, name: 'Servlet', description: 'Request handling and service-layer web endpoints in Java.' },
    { slug: 'jdbc', categoryKey: 'backend', sortOrder: 5, name: 'JDBC', description: 'Direct database access and data access patterns in Java.' },
    { slug: 'spring-boot', categoryKey: 'backend', sortOrder: 6, name: 'Spring Boot', description: 'Modern Java service development with Spring Boot.' },
    { slug: 'hibernate', categoryKey: 'backend', sortOrder: 7, name: 'Hibernate', description: 'Object-relational mapping for persistent domain models.' },
    { slug: 'jpa', categoryKey: 'backend', sortOrder: 8, name: 'JPA', description: 'Standard persistence API for Java enterprise applications.' },
    { slug: 'oracle-plsql', categoryKey: 'backend', sortOrder: 9, name: 'Oracle PL/SQL', description: 'Stored procedures, functions, and data processing in Oracle.' },
    { slug: 'microsoft-tsql', categoryKey: 'backend', sortOrder: 10, name: 'Microsoft T-SQL', description: 'Querying, scripting, and reporting logic on SQL Server.' },
    { slug: 'angular', categoryKey: 'frontend', sortOrder: 1, name: 'Angular', description: 'Component-based SPA development for enterprise UIs.' },
    { slug: 'html', categoryKey: 'frontend', sortOrder: 2, name: 'HTML', description: 'Semantic markup for accessible web interfaces.' },
    { slug: 'css', categoryKey: 'frontend', sortOrder: 3, name: 'CSS', description: 'Layout, styling, and responsive presentation.' },
    { slug: 'javascript', categoryKey: 'frontend', sortOrder: 4, name: 'JavaScript', description: 'Client-side interactivity and application logic.' },
    { slug: 'jquery', categoryKey: 'frontend', sortOrder: 5, name: 'jQuery', description: 'DOM scripting and legacy UI enhancements.' },
    { slug: 'bootstrap', categoryKey: 'frontend', sortOrder: 6, name: 'Bootstrap', description: 'Responsive UI components and layout patterns.' },
    { slug: 'mssql', categoryKey: 'databases', sortOrder: 1, name: 'Microsoft SQL Server', description: 'Relational database design, querying, and administration.' },
    { slug: 'mysql', categoryKey: 'databases', sortOrder: 2, name: 'MySQL', description: 'Relational data storage for application backends.' },
    { slug: 'oracle', categoryKey: 'databases', sortOrder: 3, name: 'Oracle', description: 'Enterprise database platforms for banking workloads.' },
    { slug: 'postgresql', categoryKey: 'databases', sortOrder: 4, name: 'PostgreSQL', description: 'Reliable open-source relational database systems.' },
    { slug: 'apache-tomcat', categoryKey: 'servers', sortOrder: 1, name: 'Apache Tomcat', description: 'Java web application server deployment and operations.' },
    { slug: 'jboss', categoryKey: 'servers', sortOrder: 2, name: 'JBoss', description: 'Enterprise Java application server environments.' },
    { slug: 'git', categoryKey: 'devops', sortOrder: 1, name: 'Git', description: 'Source control workflows for collaborative development.' },
    { slug: 'github', categoryKey: 'devops', sortOrder: 2, name: 'GitHub', description: 'Remote repositories, reviews, and collaboration.' },
    { slug: 'gitlab-cicd', categoryKey: 'devops', sortOrder: 3, name: 'GitLab CI/CD', description: 'Pipeline automation for build, test, and deployment.' },
    { slug: 'jasper-ireport', categoryKey: 'reporting', sortOrder: 1, name: 'Jasper iReport', description: 'Designing operational and regulatory report templates.' },
    { slug: 'jaspersoft-studio', categoryKey: 'reporting', sortOrder: 2, name: 'Jaspersoft Studio', description: 'Building and maintaining JasperReports Studio report designs.' },
  ]

  for (const skill of skillSeeds) {
    const translations = {
      en: { name: skill.name, description: skill.description },
      my: {
        name: skill.nameMy ?? skill.name,
        description: skill.descriptionMy ?? skill.description,
      },
    }

    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {
        categoryKey: skill.categoryKey,
        sortOrder: skill.sortOrder,
        isVisible: true,
        translations,
      },
      create: {
        slug: skill.slug,
        categoryKey: skill.categoryKey,
        sortOrder: skill.sortOrder,
        isVisible: true,
        translations,
      },
    })
  }

  await prisma.skill.deleteMany({
    where: { slug: { notIn: skillSeeds.map((skill) => skill.slug) } },
  })

  await prisma.experienceItem.deleteMany({
    where: { company: 'Personal Platform Lab' },
  })

  type ExperienceSeed = {
    company: string
    startDate: Date
    endDate: Date | null
    isCurrent: boolean
    sortOrder: number
    isVisible: boolean
    translations: {
      en: { roleTitle: string; summary: string; description: string }
      my: { roleTitle: string; summary: string; description: string }
    }
    technologies: string[]
    featuredProjectIds: string[]
  }

  async function upsertExperience(entry: ExperienceSeed) {
    const existing = await prisma.experienceItem.findFirst({
      where: {
        company: entry.company,
        startDate: entry.startDate,
      },
    })

    if (existing) {
      await prisma.experienceItem.update({
        where: { id: existing.id },
        data: entry,
      })
      return
    }

    await prisma.experienceItem.create({ data: entry })
  }

  await upsertExperience({
    company: 'ACE Data Systems Ltd.',
    startDate: new Date('2021-12-01'),
    endDate: null,
    isCurrent: true,
    sortOrder: 1,
    isVisible: true,
    translations: {
      en: {
        roleTitle: 'Team Leader',
        summary:
          'Leading delivery of CBMMIS, a MIS reporting gateway that connects financial institutions with the Central Bank of Myanmar through RESTful APIs.',
        description:
          'Led successful CBMMIS implementations for local banks, owning team-leader responsibilities and keeping delivery aligned to agreed timelines.\n\nAdapted and refined the MIS Reporting Gateway architecture to match bank-specific needs for demonstrations and production readiness. Participated in detailed requirement gathering (DRG) through direct discussions with banks.\n\nAfter DRG, developed a data query service to extract CBM report-template data from banking systems such as Core Banking, CMS (Card Management System), EB (Internet Banking), and MB (Mobile Banking), and integrated the gateway with the Central Bank of Myanmar.\n\nBalanced hands-on technical delivery with task delegation across the project team.\n\nCompany site: https://acedatasystems.com',
      },
      my: {
        roleTitle: 'Team Leader',
        summary:
          'CBMMIS (MIS Reporting Gateway) ကို ဦးဆောင်အကောင်အထည်ဖော်နေသည်။ FI banks နှင့် Central Bank of Myanmar ကို RESTful APIs ဖြင့် ချိတ်ဆက်ပေးသည်။',
        description:
          'Local banks များအတွက် CBMMIS implementation ကို Team Leader အဖြစ် ဦးဆောင်ပြီး အဖွဲ့၏ လုပ်ငန်းများကို သတ်မှတ်အချိန်အတွင်း ပြီးမြောက်စေရန် စီမံခဲ့သည်။\n\nBank လိုအပ်ချက်များအလိုက် MIS Reporting Gateway architecture ကို ပြင်ဆင်ဒီဇိုင်းဆွဲခဲ့ပြီး bank များနှင့် တိုက်ရိုက် ဆွေးနွေးကာ detailed requirement gathering (DRG) တွင် ပါဝင်ခဲ့သည်။\n\nDRG ပြီးနောက် Core Banking, CMS, EB (Internet Banking) နှင့် MB (Mobile Banking) စနစ်များမှ CBM report template အတွက် လိုအပ်သော data များကို ထုတ်ယူသည့် data query service ကို တည်ဆောက်ခဲ့ပြီး Central Bank of Myanmar နှင့် အောင်မြင်စွာ ချိတ်ဆက်ခဲ့သည်။\n\nTechnical tasks များကို ကိုယ်တိုင်လုပ်ဆောင်သည့်အပြင် အဖွဲ့သားများထံ လုပ်ငန်းများ ခွဲဝေပေးခဲ့သည်။\n\nCompany site: https://acedatasystems.com',
      },
    },
    technologies: ['RESTful APIs', 'MIS Reporting', 'Core Banking', 'CMS', 'Internet Banking', 'Mobile Banking'],
    featuredProjectIds: [],
  })

  await upsertExperience({
    company: 'ACE Data Systems Ltd.',
    startDate: new Date('2017-05-01'),
    endDate: new Date('2021-11-30'),
    isCurrent: false,
    sortOrder: 10,
    isVisible: true,
    translations: {
      en: {
        roleTitle: 'Software Engineer',
        summary:
          'Built banking integrations and reporting solutions spanning Internet Banking APIs, Finacle regulatory reporting, and core banking data migration.',
        description:
          'Contributed to an Internet Banking system for Infosys (India) by developing APIs that connected Internet Banking with Core Banking using Java, JSP, Servlet, HTML, CSS, web service APIs, Microsoft SQL Server, XML, and ISO messaging standards.\n\nDelivered a reporting project that produced the bank’s required regulatory reports from the Finacle Core Banking System using Java, PL/SQL, and Jasper iReport.\n\nAlso supported core banking implementation through data migration from the bank’s legacy systems into Finacle.\n\nCompany site: https://acedatasystems.com',
      },
      my: {
        roleTitle: 'Software Engineer',
        summary:
          'Internet Banking APIs, Finacle regulatory reporting နှင့် core banking data migration အပါအဝင် banking integrations များကို တည်ဆောက်ခဲ့သည်။',
        description:
          'Infosys (India) အတွက် Internet Banking System တွင် Internet Banking နှင့် Core Banking ကို ချိတ်ဆက်သော APIs များကို Java, JSP, Servlet, HTML, CSS, web service APIs, Microsoft SQL Server, XML နှင့် ISO standards တို့ဖြင့် တည်ဆောက်ခဲ့သည်။\n\nFinacle Core Banking System မှ bank ၏ regulatory reports များကို Java, PL/SQL နှင့် Jasper iReport တို့ဖြင့် ထုတ်လုပ်ခဲ့သည်။\n\nCore Banking implementation အတွက် bank ၏ legacy systems မှ Finacle သို့ data migration ကိုလည်း ဆောင်ရွက်ခဲ့သည်။\n\nCompany site: https://acedatasystems.com',
      },
    },
    technologies: [
      'Java',
      'JSP',
      'Servlet',
      'HTML',
      'CSS',
      'Web Services',
      'Microsoft SQL Server',
      'XML',
      'PL/SQL',
      'Jasper iReport',
      'Finacle',
    ],
    featuredProjectIds: [],
  })

  await upsertExperience({
    company: 'Myanmar Information Technology',
    startDate: new Date('2013-09-01'),
    endDate: new Date('2016-11-30'),
    isCurrent: false,
    sortOrder: 20,
    isVisible: true,
    translations: {
      en: {
        roleTitle: 'Senior Java Developer',
        summary:
          'Delivered hospital information systems and customer-facing Java applications, including Electronic Medical Records and Queue Management.',
        description:
          'Worked closely with customers to gather requirements, advise on business workflows, and translate operational needs into practical software designs.\n\nDesigned entity-relationship diagrams and application forms, and contributed across the full delivery lifecycle—system analysis, development, coding, testing, and release—while collaborating with the wider engineering team.\n\nBuilt and maintained applications using Java, JSP, Servlet, JavaScript, CSS, GWT, JDBC, Microsoft SQL Server, JasperReports, and Apache Tomcat.\n\nKey projects included eMR (Electronic Medical Records) for patient registration, medical record keeping, and doctor appointment scheduling, and QMS (Queue Management System) for hospital service-counter queue handling.\n\nAlso mentored junior developers on coding standards, problem-solving approaches, and consistent software delivery practices.\n\nCompany site: http://www.mit.com.mm',
      },
      my: {
        roleTitle: 'Senior Java Developer',
        summary:
          'Hospital information systems နှင့် customer-facing Java applications များကို တည်ဆောက်ခဲ့သည်။ eMR နှင့် Queue Management System များ ပါဝင်သည်။',
        description:
          'Customer များနှင့် တိုက်ရိုက် ဆက်သွယ်ကာ requirement gathering လုပ်ခြင်း၊ business workflow များကို အကြံပြုညှိနှိုင်းခြင်း၊ ERD နှင့် project forms များကို ဒီဇိုင်းဆွဲခြင်းတို့ကို ဆောင်ရွက်ခဲ့သည်။\n\nSystem analysis, development, coding, testing နှင့် release management အပါအဝင် software development lifecycle တစ်ခုလုံးတွင် အဖွဲ့နှင့် ပူးပေါင်းလုပ်ဆောင်ခဲ့သည်။\n\nJava, JSP, Servlet, JavaScript, CSS, GWT, JDBC, Microsoft SQL Server, JasperReports နှင့် Apache Tomcat တို့ကို အသုံးပြု၍ applications များကို တည်ဆောက်ထိန်းသိမ်းခဲ့သည်။\n\neMR တွင် patient registration, medical record keeping နှင့် doctor appointment scheduling ပါဝင်ပြီး QMS သည် hospital service counters များအတွက် queue management စနစ်ဖြစ်သည်။\n\nJunior developers များကို coding standards နှင့် problem-solving အတွက် လေ့ကျင့်ပံ့ပိုးပေးခဲ့သည်။\n\nCompany site: http://www.mit.com.mm',
      },
    },
    technologies: [
      'Java',
      'JSP',
      'Servlet',
      'JavaScript',
      'CSS',
      'GWT',
      'JDBC',
      'Microsoft SQL Server',
      'JasperReports',
      'Apache Tomcat',
    ],
    featuredProjectIds: [],
  })

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