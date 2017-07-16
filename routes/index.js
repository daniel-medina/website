/** Importing modules */
import express from 'express'

/** Declaring the router */
const router = express.Router()

/* >>>>>>>>>>>>>>>>>>>> GET <<<<<<<<<<<<<<<<<<<< */
/** Middlewares */

/** Article */
router.get('/article/:url([a-z0-9_-]{1,})?', require('../middlewares/blog').articleExist)
router.get('/article/:url([a-z0-9_-]{1,})?', require('../middlewares/blog').views)
/** Archive */
router.get('/archive/:page([0-9]{1,})?', require('../middlewares/blog').archivePageCheck)
/** Administration
  * All admin routes must be linked to isAuthenticated middleware to ensure safety */
router.get('/admin', require('../middlewares/admin/index').isAuthenticated)

/** Next requests */

/** Index */
router.get('/', require('../controllers/blog').getIndex)
/** Article */
router.get('/article/:url([a-z0-9_-]{1,})?', require('../controllers/blog').getArticle)
/** Archive */
router.get('/archive/:page([0-9]{1,})?', require('../controllers/blog').getArchive)
/** Administration */
router.get('/admin', require('../controllers/admin/index').getIndex)
router.get('/admin/blog', require('../controllers/admin/blog').getIndex)

/* >>>>>>>>>>>>>>>>>>>> POST <<<<<<<<<<<<<<<<<<<< */
/** Middlewares */

/** Administration */
router.post('/admin/blog', require('../middlewares/admin/blog').postArticle)
router.post('/admin/blog', require('../middlewares/admin/blog').articleCategoryExist)
router.post('/admin/blog', require('../middlewares/admin/blog').articleTitleExist)

/** Next requests */

/** Administration */
router.post('/admin/blog', require('../controllers/admin/blog').postBlog)

/** Now exporting the routes */
export default router
