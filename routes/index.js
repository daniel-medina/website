/** Imports goes here */
import express from 'express'

/** Controllers */
import * as AdminController from '../controllers/admin'
import * as BlogController from '../controllers/blog'
import * as PortfolioController from '../controllers/portfolio'
import * as SessionController from '../controllers/session'

/** Middlewares */
import * as GlobalMiddleware from '../middlewares/global'
import * as AdminMiddleware from '../middlewares/admin'
import * as BlogMiddleware from '../middlewares/blog'

const router = express.Router()

// GET REQUESTS {{{
// --->>> MIDDLEWARES <<<--- {{{
// Global {{{
router.get('/xhr/*', GlobalMiddleware.all.ajaxProtection)
// }}}
// Blog {{{
router.get('/article/:url([a-z0-9_-]{1,})?', BlogMiddleware.get.articleExist)
router.get('/article/:url([a-z0-9_-]{1,})?', BlogMiddleware.get.views)
router.get('/archive/:page([0-9]{1,})?', BlogMiddleware.get.archivePageCheck)
// }}}
// Admin {{{
/** The auth middleware must be defined to all admin routes, including its index */
router.get('/admin', AdminMiddleware.all.isAuth)
router.get('/admin/*', AdminMiddleware.all.isAuth)
router.get('/admin/account/delete/:id([a-z0-9]{1,})', AdminMiddleware.get.accountIdExist)
router.get('/admin/account/delete/:id([a-z0-9]{1,})', AdminMiddleware.get.accountDeleteSelf)
router.get('/admin/article/delete/:id([a-z0-9]{1,})', AdminMiddleware.get.articleIdExist)
router.get('/admin/article/edit/:id([a-z0-9]{1,})', AdminMiddleware.get.articleIdExist)
router.get('/admin/article-category/delete/:id([a-z0-9]{1,})', AdminMiddleware.get.articleCategoryIdExist)
// }}}
// }}}
// --->>> CONTROLLERS <<<--- {{{
// Admin {{{
router.get('/admin', AdminController.get.index)
router.get('/admin/authentication', AdminController.get.authentication)
router.get('/admin/disconnect', AdminController.get.disconnect)
router.get('/admin/account', AdminController.get.account)
router.get('/admin/account/delete/:id([a-z0-9]{1,})', AdminController.get.deleteAccount)
router.get('/admin/blog/:page?', AdminController.get.blog)
router.get('/admin/article/create', AdminController.get.newArticle)
router.get('/admin/article/edit/:id([a-z0-9]{1,})', AdminController.get.editArticle)
router.get('/admin/article/delete/:id([a-z0-9]{1,})', AdminController.get.deleteArticle)
router.get('/admin/article-category/delete/:id([a-z0-9]{1,})', AdminController.get.deleteCategory)
router.get('/admin/portfolio/framework', AdminController.get.frameworks)
// }}}
// Blog {{{
router.get('/', BlogController.get.index)
router.get('/article/:url([a-z0-9_-]{1,})?', BlogController.get.article)
router.get('/archive/:page([0-9]{1,})?', BlogController.get.archive)
// }}}
// Portfolio {{{
router.get('/portfolio', PortfolioController.get.index)
router.get('/xhr/portfolio/projects', PortfolioController.get.projects)
// }}}}
// Sessions {{{
router.get('/session/get', SessionController.get.session)
// }}}}
// }}}
// }}}

// POST REQUESTS {{{
// --->>> MIDDLEWARES <<<--- {{{
// Global {{{
router.post('/xhr/*', GlobalMiddleware.all.ajaxProtection)
// }}}
// Admin {{{
router.post('/admin/*', AdminMiddleware.all.isAuth)
router.post('/admin/account', AdminMiddleware.post.account)
router.post('/admin/account', AdminMiddleware.post.accountUsernameExist)
router.post('/admin/article/create', AdminMiddleware.post.article)
router.post('/admin/article/create', AdminMiddleware.post.articleCategoryExist)
router.post('/admin/article/create', AdminMiddleware.post.articleTitleExist)
router.post('/admin/article-category/create', AdminMiddleware.post.articleCategory)
router.post('/admin/article-category/create', AdminMiddleware.post.articleCategoryTitleExist)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', AdminMiddleware.post.article)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', AdminMiddleware.post.articleCategoryExist)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', AdminMiddleware.post.articleTitleExist)
router.post('/admin/portfolio/framework/create', AdminMiddleware.post.framework)
router.post('/admin/portfolio/framework/create', AdminMiddleware.post.frameworkExist)
// }}}
// }}}
// --->>> CONTROLLERS <<<--- {{{
// Admin {{{
router.post('/admin/account', AdminController.post.account)
router.post('/admin/article/create', AdminController.post.newArticle)
router.post('/admin/article-category/create', AdminController.post.articleCategory)
router.post('/admin/article/edit/:id([a-z0-9]{1,})', AdminController.post.editArticle)
router.post('/admin/portfolio/framework/create', AdminController.post.newFramework)
router.post('/admin/authentication', AdminController.post.authentication)
// }}}
// }}}
// }}}

export default router
