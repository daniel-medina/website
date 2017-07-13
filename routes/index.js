/** Importing modules */
import express from 'express'

/** Declaring the router */
const router = express.Router()

/* >>>>>>>>>>>>>>>>>>>> GET <<<<<<<<<<<<<<<<<<<< */
/** Middlewares */
router.get('/article/:url([a-z0-9-])?', require('../middlewares/blog').articleExist)
router.get('/article/:url([a-z0-9-])?', require('../middlewares/blog').views)
router.get('/archive/:page([0-9])?', require('../middlewares/blog').archivePageCheck)

/** Next requests */
router.get('/', require('../controllers/blog').getIndex)
router.get('/article/:url([a-z0-9-]{1,})?', require('../controllers/blog').getArticle)
router.get('/archive/:page([0-9])?', require('../controllers/blog').getArchive)
router.get('/admin', require('../controllers/admin/blog').getIndex)
router.get('/admin/blog', require('../controllers/admin/blog').getBlog)

/* >>>>>>>>>>>>>>>>>>>> POST <<<<<<<<<<<<<<<<<<<< */
/** Middlewares */
router.post('/admin/blog', require('../middlewares/admin/blog').postArticle)
router.post('/admin/blog', require('../middlewares/admin/blog').articleCategoryExist)
router.post('/admin/blog', require('../middlewares/admin/blog').articleTitleExist)

/** Next requests */
router.post('/admin/blog', require('../controllers/admin/blog').postBlog)

/** Now exporting the routes */
export default router
