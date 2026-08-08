import path from 'node:path'

import { Router } from 'express'
import multer from 'multer'

import { adminController } from '../../controllers/admin.controller'
import { env } from '../../config/env'
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware'

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, env.uploadDirAbsolute),
  filename: (_request, file, callback) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`
    callback(null, `${suffix}${path.extname(file.originalname)}`)
  },
})

const upload = multer({ storage })
const router = Router()
const adminRouter = Router()

adminRouter.use(authMiddleware, requireAdmin)

adminRouter.get('/dashboard', adminController.dashboard)
adminRouter.get('/home', adminController.homeGet)
adminRouter.patch('/home', adminController.homePatch)
adminRouter.get('/about', adminController.aboutGet)
adminRouter.patch('/about', adminController.aboutPatch)

adminRouter.get('/experience', adminController.experienceList)
adminRouter.post('/experience', adminController.experienceCreate)
adminRouter.get('/experience/:id', adminController.experienceGet)
adminRouter.patch('/experience/:id', adminController.experiencePatch)
adminRouter.delete('/experience/:id', adminController.experienceDelete)

adminRouter.get('/skills', adminController.skillsList)
adminRouter.post('/skills', adminController.skillsCreate)
adminRouter.get('/skills/:id', adminController.skillsGet)
adminRouter.patch('/skills/:id', adminController.skillsPatch)
adminRouter.delete('/skills/:id', adminController.skillsDelete)

adminRouter.get('/projects', adminController.projectsList)
adminRouter.post('/projects', adminController.projectsCreate)
adminRouter.get('/projects/:id', adminController.projectsGet)
adminRouter.patch('/projects/:id', adminController.projectsPatch)
adminRouter.delete('/projects/:id', adminController.projectsDelete)

adminRouter.get('/blog/posts', adminController.postsList)
adminRouter.post('/blog/posts', adminController.postsCreate)
adminRouter.get('/blog/posts/:id', adminController.postsGet)
adminRouter.patch('/blog/posts/:id', adminController.postsPatch)
adminRouter.delete('/blog/posts/:id', adminController.postsDelete)

adminRouter.get('/blog/categories', adminController.categoriesList)
adminRouter.post('/blog/categories', adminController.categoriesCreate)
adminRouter.patch('/blog/categories/:id', adminController.categoriesPatch)
adminRouter.delete('/blog/categories/:id', adminController.categoriesDelete)

adminRouter.get('/blog/tags', adminController.tagsList)
adminRouter.post('/blog/tags', adminController.tagsCreate)
adminRouter.patch('/blog/tags/:id', adminController.tagsPatch)
adminRouter.delete('/blog/tags/:id', adminController.tagsDelete)

adminRouter.get('/uploads', adminController.uploadsList)
adminRouter.post('/uploads', upload.single('file'), adminController.uploadsCreate)
adminRouter.delete('/uploads/:id', adminController.uploadsDelete)

adminRouter.get('/settings', adminController.settingsGet)
adminRouter.patch('/settings', adminController.settingsPatch)

router.use('/admin', adminRouter)

export { router as adminRoutes }