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
/** The auth middleware must be defined to all admin routes, including its index */
router.get('/admin', require('../middlewares/admin').isAuth)
router.get('/admin/*', require('../middlewares/admin').isAuth)
router.get('/admin/article/delete/:id([a-z0-9]{1,})', require('../middlewares/admin').articleIdExist)
router.get('/admin/article/edit/:id([a-z0-9]{1,})', require('../middlewares/admin').articleIdExist)
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
router.get('/admin/blog/:page?', require('../controllers/admin').getBlog)
router.get('/admin/article/create', require('../controllers/admin').getNewArticle)
router.get('/admin/article/edit/:id([a-z0-9]{1,})', require('../controllers/admin').getEditArticle)
router.get('/admin/article/delete/:id([a-z0-9]{1,})', require('../controllers/admin').deleteArticle)
// }}}
// }}}
// }}}

// POST REQUESTS {{{
// --->>> MIDDLEWARES <<<--- {{{
// Admin {{{
router.post('/admin/*', require('../middlewares/admin').isAuth)
router.post('/admin/article/create', require('../middlewares/admin').postArticle)
router.post('/admin/article/create', require('../middlewares/admin').articleCategoryExist)
router.post('/admin/article/create', require('../middlewares/admin').articleTitleExist)
router.post('/admin/article-category/create', require('../middlewares/admin').postArticleCategory)
router.post('/admin/article-category/create', require('../middlewares/admin').articleCategoryTitleExist)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', require('../middlewares/admin').postArticle)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', require('../middlewares/admin').articleCategoryExist)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', require('../middlewares/admin').articleTitleExist)
// }}}
// }}}

// --->>> CONTROLLERS <<<--- {{{
// Admin {{{
router.post('/admin/article/create', require('../controllers/admin').postNewArticle)
router.post('/admin/article-category/create', require('../controllers/admin').postArticleCategory)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', require('../controllers/admin').postEditArticle)
router.post('/admin/authentication', require('../controllers/admin').postAuthentication)
// }}}
// }}}
// }}}

export default router
