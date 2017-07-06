/** Importing modules */
import express from 'express'

/** Declaring the router */
const router = express.Router()

/* >>>>>>>>>>>>>>>>>>>> GET <<<<<<<<<<<<<<<<<<<< */
/** Middlewares */
router.get('/article/:url', require('../middlewares/blog').articleExist)

/** Next requests */
router.get('/', require('../controllers/blog').getIndex)
router.get('/article/:url', require('../controllers/blog').getArticle)
router.get('/archive', (request, resource) => {
  resource.render('blog/archive', {
    title: 'Archive'
  })
})
router.get('/admin', require('../controllers/admin/blog').getIndex)
router.get('/admin/blog', require('../controllers/admin/blog').getBlog)

/* >>>>>>>>>>>>>>>>>>>> POST <<<<<<<<<<<<<<<<<<<< */
/** Middlewares */
router.post('/admin/blog', require('../middlewares/admin/blog').postBlog)

/** Next requests */
router.post('/admin/blog', require('../controllers/admin/blog').postBlog)

/** Now exporting the routes */
export default router
