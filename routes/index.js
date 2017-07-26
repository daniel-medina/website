/** Imports goes here */
import express from 'express'

const router = express.Router()

// GET REQUESTS {{{
// --->>> MIDDLEWARES <<<--- {{{
// Blog {{{
router.get('/article/:url([a-z0-9_-]{1,})?', require('../middlewares/blog').articleExist)
router.get('/article/:url([a-z0-9_-]{1,})?', require('../middlewares/blog').views)
router.get('/archive/:page([0-9]{1,})?', require('../middlewares/blog').archivePageCheck)
// }}}
// Admin {{{
router.get('/admin', require('../middlewares/admin').isAuth)
router.get('/admin/authentication', require('../middlewares/admin').isAuth)
router.get('/admin/disconnect', require('../middlewares/admin').isAuth)
router.get('/admin/blog', require('../middlewares/admin').isAuth)
router.get('/admin/article/create', require('../middlewares/admin').isAuth)
// }}}
// }}}

// --->>> CONTROLLERS <<<--- {{{
// Blog {{{
router.get('/', require('../controllers/blog').getIndex)
router.get('/article/:url([a-z0-9_-]{1,})?', require('../controllers/blog').getArticle)
router.get('/archive/:page([0-9]{1,})?', require('../controllers/blog').getArchive)
// }}}
// Admin {{{
router.get('/admin', require('../controllers/admin').getIndex)
router.get('/admin/authentication', require('../controllers/admin').getAuthentication)
router.get('/admin/disconnect', require('../controllers/admin').disconnect)
// router.get('/admin/blog', require('../controllers/admin').getBlog)
router.get('/admin/article/create', require('../controllers/admin').getNewArticle)
// }}}
// }}}
// }}}

// POST REQUESTS {{{
// --->>> MIDDLEWARES <<<--- {{{
// Admin {{{
router.post('/admin/blog', require('../middlewares/admin').isAuth)
router.post('/admin/article/create', require('../middlewares/admin').isAuth)
router.post('/admin/authentication', require('../middlewares/admin').isAuth)
router.post('/admin/article/create', require('../middlewares/admin').postArticle)
router.post('/admin/article/create', require('../middlewares/admin').articleCategoryExist)
router.post('/admin/article/create', require('../middlewares/admin').articleTitleExist)
// }}}
// }}}

// --->>> CONTROLLERS <<<--- {{{
// Admin {{{
router.post('/admin/article/create', require('../controllers/admin').postNewArticle)
router.post('/admin/authentication', require('../controllers/admin').postAuthentication)
// }}}
// }}}
// }}}

export default router
