import { Router } from 'express'

import { publicController } from '../../controllers/public.controller'

const router = Router()

router.get('/public/site-settings', publicController.siteSettings)
router.get('/public/navigation', publicController.navigation)
router.get('/public/home', publicController.home)
router.get('/public/about', publicController.about)
router.get('/public/experience', publicController.experience)
router.get('/public/skills', publicController.skills)
router.get('/public/blog/posts', publicController.blogPosts)
router.get('/public/blog/posts/:slug', publicController.blogPost)
router.get('/public/blog/categories', publicController.blogCategories)
router.get('/public/blog/tags', publicController.blogTags)
router.get('/public/blog/search', publicController.blogSearch)

export { router as publicRoutes }