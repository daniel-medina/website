/**
 * Admin Controller
 * Controls the admin panel
 *
 * @author Daniel Medina
 * Date: 07/18/2017
 */

/** Configs imports */
import {adminBlogItemPerPage} from '../config/blog'
import {colors} from '../config/portfolio'

/** Modules imports */
import slug from 'slug'
import uuid from 'uuid/v4'

/** Models imports */
import Admin from '../models/admin'
import Article from '../models/article'
import Project from '../models/project'
import {ArticleCategory} from '../models/refs/articleCategory'
import {Framework} from '../models/refs/framework'
import {Language} from '../models/refs/language'

/** Libs imports */
import Password from '../lib/password'

/** GET */
export const get = {
  // Controller: disconnect {{{
  /**
   * Disconnect from the current session
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  disconnect: async (request, response) => {
    try {
    /** We destroy the session */
      request.session.destroy()

      /** Then we redirect the user to the index */
      response.redirect('/')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: index {{{
  /**
   * Returns the index view of the admin panel
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  index: async (request, response) => {
    try {
      response.render('admin/index', {
        title: 'Administration'
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: blog {{{
  /**
   * Blog's administration index
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  blog: async (request, response) => {
    try {
      // Function: getAmount {{{
      /**
       * Get the amount of existing article
       *
       * @returns {Promise} Promise containing the amount of existing article
       * @see Mongoose
       */
      const getAmount = () => {
        return Article
          .count({})
          .exec()
      }
      // }}}
      // Function: getArticles {{{
      /**
       * Gets all existing articles
       *
       * @returns {Promise} Promise containing all the articles
       * @see Mongoose
       */
      const getArticles = page => {
        const rawSkip = Math.floor(page * adminBlogItemPerPage)
        const skip = Math.floor(rawSkip - adminBlogItemPerPage)
        const query = {
          limit: adminBlogItemPerPage,
          skip: skip,
          sort: {
            _id: -1
          }
        }

        return Article
          .find({})
          .limit(query.limit)
          .skip(query.skip)
          .sort(query.sort)
          .populate('category', 'title')
          .exec()
      }
      // }}}
      // Function: getArticleCategories {{{
      /**
       * Gets article's categories
       *
       * @param {Type} tag Description
       * @returns {Type} tag
       */
      const getArticleCategories = () => {
        return ArticleCategory
          .find({})
          .exec()
      }
      // }}}

      /** We get all the article to display them */
      /** If the current page is superior to 1, we use the url's parameter, else we set it to 1 */
      const page = Number((request.params.page > 1) ? request.params.page : 1)
      const amount = await getAmount()
      const articles = await getArticles(page)
      const categories = await getArticleCategories()
      const maxPage = Math.ceil(amount / adminBlogItemPerPage)
      const pagination = await response.locals.pagination.links(amount, page, maxPage, adminBlogItemPerPage)

      /** Rendering the view ... */
      response.render('admin/blog/index', {
        title: 'Blog administration',
        amount: amount,
        page: page,
        maxPage: maxPage,
        pagination: pagination,
        articles: articles,
        categories: categories
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: portfolio {{{
  /**
   * Handles the portfolio management
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  portfolio: async (request, response) => {
    try {
      response.render('admin/portfolio/index', {
        title: 'Portfolio'
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: frameworks {{{
  /**
   * Manages frameworks that are used on portfolio's projects
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  frameworks: async (request, response) => {
    try {
      // Function: getFrameworks {{{
      /**
       * Get frameworks available in the database
       *
       * @returns {Promise} object containing all frameworks
       * @see Mongoose
       */
      const getFrameworks = () => Framework.find({}).exec()
      // }}}

      const frameworks = await getFrameworks()

      response.render('admin/portfolio/framework', {
        title: 'Frameworks management',
        frameworks: frameworks,
        colors: colors
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: languages {{{
  /**
   * Manages languages that are used on portfolio's projects
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  languages: async (request, response) => {
    try {
      // Function: getLanguages {{{
      /**
       * Get languages available in the database
       *
       * @returns {Promise} object containing all languages
       * @see Mongoose
       */
      const getLanguages = () => Language.find({}).exec()
      // }}}

      const languages = await getLanguages()

      response.render('admin/portfolio/language', {
        title: 'Languages management',
        languages: languages,
        colors: colors
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: authentication {{{
  /**
   * Returns the authentication view
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  authentication: async (request, response) => {
    try {
      response.render('admin/authentication', {
        title: 'Authentication'
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: newArticle {{{
  /**
   * Page form to create a new article
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  newArticle: async (request, response) => {
    try {
      // Function: getCategories {{{
      /**
       * Get all article categories
       *
       * @returns {Promise} Promise containing all article categories
       * @see Mongoose
       */
      const getCategories = () => {
        return ArticleCategory
          .find({})
          .exec()
      }
      // }}}

      const categories = await getCategories()

      response.render('admin/article/create', {
        title: 'Create an article',
        categories: categories
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: editArticle {{{
  /**
   * Send to the user the form to edit an article
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  editArticle: async (request, response) => {
    try {
      // Function: getArticle {{{
      /**
       * Get the information of the article
       *
       * @param {ObjectID} id ID of the article to edit
       * @returns {Promise} Promise containing the article's information
       * @see Mongoose
       */
      const getArticle = id => {
        const query = {
          _id: id
        }

        return Article
          .findOne(query)
          .populate('category', 'title')
          .exec()
      }
      // }}}
      // Function: getCategories {{{
      /**
       * Get all article categories
       *
       * @returns {Promise} Promise containing all article categories
       * @see Mongoose
       */
      const getCategories = () => ArticleCategory.find({}).exec()
      // }}}

      /**
       * We get the id given by the user on the route, then get the article from it
       * We also get all categories of article
       * The middleware will handle the verifications
       */
      const id = request.params.id
      const article = await getArticle(id)
      const categories = await getCategories()

      /** Now we can return the view to the user, that will comes with the current article's information */
      response.render('admin/article/edit', {
        title: 'Edit an article',
        article: article,
        categories: categories
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: account {{{
  /**
   * Page to manage administrators
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  account: async (request, response) => {
    try {
      // Function: getAdmins {{{
      /**
       * Get all the admins
       *
       * @returns {Promise} Promise containing all the admins
       * @see Mongoose
       */
      const getAdmins = () => {
        return Admin
          .find({})
          .exec()
      }
      // }}}

      const admins = await getAdmins()

      response.render('admin/account/index', {
        title: 'Account management',
        admins: admins
      })
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: deleteArticle {{{
  /**
   * Deletes an article
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  deleteArticle: async (request, response) => {
    try {
      // Function: deleteArticle {{{
      /**
       * Deletes the article
       *
       * @param {ObjectID} id ID of the article to delete
       * @returns {Promise} Promise containing the removal query of the article
       * @see Mongoose
       */
      const deleteArticle = id => {
        const query = {
          _id: id
        }

        return Article
          .remove(query)
          .exec()
      }
      // }}}

      /**
       * We get the given ID by the user
       * Then we execute the function to delete the article
       * Verifications are done by a middleware
       */
      const id = request.params.id

      await deleteArticle(id)

      /** Now that it is done, redirect the user back and show him a confirmation message */
      request.flash('success', 'The article \'' + id + '\' has been deleted successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: deleteCategory {{{
  /**
   * Handles the deletion of a category
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  deleteCategory: async (request, response) => {
    try {
      // Function: deleteCategory {{{
      /**
       * Delete the category
       *
       * @param {ObjectID} id Id of the category to delete
       * @returns {Promise} Promise containing the category's deletion query
       * @see Mongoose
       */
      const deleteCategory = id => {
        const query = {
          _id: id
        }

        return ArticleCategory
          .remove(query)
      }
      // }}}
      // Function: deleteArticles {{{
      /**
       * Delete every article related to the deleted category
       *
       * @param {ObjectID} id Id of the category
       * @returns {Promise} Promise containing the article's deletion query
       * @see Mongoose
       */
      const deleteArticles = id => {
        const query = {
          category: {
            _id: id
          }
        }

        return Article
          .remove(query)
      }
      // }}}

      const id = request.params.id

      /** Executing the delete functions */
      await deleteCategory(id)
      await deleteArticles(id)

      /** After the category has been deleted successfully, redirect the user and flash him a confirmation message */
      request.flash('success', 'The category \'' + id + '\' has been deleted successfully. So are all article bound to that category.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: deleteAccount {{{
  /**
   * Handles the deletion of an account
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  deleteAccount: async (request, response) => {
    try {
      // Function: deleteAccount {{{
      /**
       * Deletes the account matching the given id
       *
       * @param {ObjectID} id ID of the account to delete
       * @returns {Promise} Promise containing the removal request
       */
      const deleteAccount = id => {
        const query = {
          _id: id
        }

        return Admin
          .remove(query)
      }
      // }}}

      /** We get the id provided by the user */
      const id = request.params.id

      /** Then we execute the delete function */
      await deleteAccount(id)

      request.flash('success', 'The account \'' + id + '\' has been deleted successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: deleteFramework {{{
  /**
   * Handles the deletion of a framework
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  deleteFramework: async (request, response) => {
    try {
      // Function: deleteFramework {{{
      /**
       * Delete the selected framework
       *
       * @param {ObjectID} id Id of the framework to delete
       * @returns {Promise} Promise containing the execution of the deletion
       */
      const deleteFramework = id => Framework.findOneAndRemove({ _id: id }).exec()
      // }}}

      /** We get the id provided by the user in the url */
      const id = request.params.id

      /** We delete the framework */
      await deleteFramework(id)

      /** Then we redirect the user back */
      request.flash('success', 'The framework was successfully deleted.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: deleteLanguage {{{
  /**
   * Handles the deletion of a language
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  deleteLanguage: async (request, response) => {
    try {
      // Function: deleteLanguage {{{
      /**
       * Delete the selected language
       *
       * @param {ObjectID} id Id of the language to delete
       * @returns {Promise} Promise containing the execution of the deletion
       */
      const deleteLanguage = id => Language.findOneAndRemove({ _id: id }).exec()
      // }}}

      /** We get the id provided by the user in the url */
      const id = request.params.id

      /** We delete the framework */
      await deleteLanguage(id)

      /** Then we redirect the user back */
      request.flash('success', 'The language was successfully deleted.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}

/** POST */
export const post = {
  // Controller: authentication {{{
  /**
   * Handles the user sent authentication form
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  authentication: async (request, response) => {
    try {
      // Function: checkUsername {{{
      /**
       * Checks if the given username exist in the database
       *
       * @param {String} username The given username by the user
       * @returns {Promise} Promise containing the amount of admin matching the given username
       * @see Mongoose
       */
      const checkUsername = username => {
        return Admin
          .count({ username: username })
          .exec()
      }
      // }}}
      // Function: checkPassword {{{
      /**
       * Check if the given password is correct
       *
       * @param {Object} admin Current admin
       * @param {Number} adminAmount Number of admin that matches the given username
       * @param {Boolean} compare Password verification using bcrypt
       * @see bcrypt
       */
      const checkPassword = (admin, adminAmount, compare) => {
        /** If the username matches an admin */
        if (adminAmount === 1) {
          /** We can now check if the password is correct */
          if (compare) {
          /** We update its session */
            request.session.admin = {
              token: uuid(),
              id: admin.id,
              username: admin.username,
              password: admin.password
            }

            /** Now we flash a message to the user after redirecting him */
            request.flash('success', 'You successfully logged in as ' + username + '.')
            response.redirect('/admin')
          } else {
            request.flash('error', 'The given password is not correct.')
            response.redirect('back')
          }
        } else {
          request.flash('error', 'The given username doesn\'t exist in the database.')
          response.redirect('back')
        }
      }
      // }}}
      // Function: getAdmin {{{
      /**
       * Gets the info of the admin, if he exist
       *
       * @param {String} username Username given by the user
       * @returns {Promise} Promise containing the info of the admin
       * @see Mongoose
       */
      const getAdmin = username => {
        return Admin
          .findOne({ username: username })
          .exec()
      }
      // }}}

      /** We grab necessary informations for the verification */
      const username = request.body.username
      const password = request.body.password
      const adminAmount = await checkUsername(username)
      const admin = await getAdmin(username)
      const compare = await Password.compare(password, admin.password)

      /** We execute the function */
      await checkPassword(admin, adminAmount, compare)
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: newArticle {{{
  /**
   * Handles the user sent article via the form
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  newArticle: async (request, response) => {
    try {
      // Function: createArticle {{{
      /**
       * Create a new article
       *
       * @returns {Promise} Promise containing the query execution
       * @see Mongoose
       */
      const createArticle = () => {
        const created = new Date()
        const title = request.body.title
        const url = slug(title)
        const category = request.body.category
        const content = request.body.content
        const query = {
          created: created,
          url: url,
          category: category,
          title: title,
          content: content
        }

        return Article.create(query)
      }
      // }}}

      /** We execute the creation of the article */
      await createArticle()

      request.flash('success', 'The article was successfully created.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: newProject {{{
  /**
   * Handles the creation of a project on the portfolio
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  newProject: async (request, response) => {
    try {
      // Function: create {{{
      /**
       * Create the project
       * We take only the title, the user will be able to
       * Modify the project later on
       *
       * @param {Date} created Creation date of the project
       * @param {String} title Title of the project
       * @param {String} description Description of the project
       * @param {Object} frameworks Frameworks used on the project
       * @param {Object} languages Languages used on the project
       * @param {Array} images Images of the project
       * @param {Array} tags Tags affected to the project
       * @param {String} url Url to access the project
       * @param {String} visible Whether the project is public or private
       * @returns {Promise} Promise executing the creation of the project
       */
      const create = (created, title, description, frameworks, languages, images, tags, url, visibility) => Project.create({
        created: created,
        title: title,
        description: description,
        frameworks: frameworks,
        languages: languages,
        images: images,
        tags: tags,
        url: url,
        visibility: visibility
      })
      // }}}

      /** We get the title sent by the user via POST */
      const title = request.body.title

      /** We generate placeholder variables for the project */
      const description = ''
      const frameworks = []
      const languages = []
      const images = []
      const tags = []
      const url = ''
      const visibility = 'private'

      /** We get the date to define the creation date */
      const created = new Date()

      /** We now create the project */
      await create(created, title, description, frameworks, languages, images, tags, url, visibility)

      /** We may now redirect the user back and flash him a success message */
      request.flash('success', 'The project \'' + title + '\' was created successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: newFramework {{{
  /**
   * Handles the creation of a new framework
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  newFramework: async (request, response) => {
    try {
      // Function: create {{{
      /**
       * Inserts the new framework inside the database
       *
       * @param {String} name Name of the framework
       * @param {String} color Color of the framework
       * @returns {Promise} creation of the framework
       * @see Mongoose
       */
      const create = (name, color) => Framework.create({
        created: new Date(),
        name: name,
        color: color })
      // }}}

      /** We convert the name to lowercase because uppercase characters are not needed */
      const name = request.body.name.toLowerCase()
      const color = request.body.color

      /** Execute the creation of the framework */
      await create(name, color)

      /** Redirect the user back when it's done */
      request.flash('success', 'The framework ' + name + ' was created successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: newLanguage {{{
  /**
   * Handles the creation of a new language
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  newLanguage: async (request, response) => {
    try {
      // Function: create {{{
      /**
       * Inserts the new language inside the database
       *
       * @param {String} name Name of the language
       * @param {String} color Color of the language
       * @returns {Promise} creation of the language
       * @see Mongoose
       */
      const create = (name, color) => Language.create({
        created: new Date(),
        name: name,
        color: color })
      // }}}

      /** We convert the name to lowercase because uppercase characters are not needed */
      const name = request.body.name.toLowerCase()
      const color = request.body.color

      /** Execute the creation of the language */
      await create(name, color)

      /** Redirect the user back when it's done */
      request.flash('success', 'The language ' + name + ' was created successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: editArticle {{{
  /**
   * Handle the information sent by the user in order to
   * Update an article
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  editArticle: async (request, response) => {
    try {
      // Function: updateArticle {{{
      /**
       * Edit the article
       *
       * @param {ObjectID} id ID of the article to edit
       * @returns {Promise} Promise containing the update query
       * @see Mongoose
       */
      const updateArticle = id => {
        const title = request.body.title
        const url = slug(title)
        const category = request.body.category
        const content = request.body.content
        const update = {
          url: url,
          category: category,
          title: title,
          content: content
        }
        const query = {
          _id: id
        }

        return Article
          .findOneAndUpdate(query, update)
      }
      // }}}

      const id = request.params.id

      /** We execute the asynchronous update query */
      await updateArticle(id)

      /** Then we redirect the user back with a message; middlewares will handle the error and checks */
      request.flash('success', 'The article ' + request.body.title + ' has been updated successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: articleCategory {{{
  /**
   * Handles the creation of a new article category
   * Further verifications are done in the affected middleware
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  articleCategory: async (request, response) => {
    try {
      // Function: createCategory {{{
      /**
       * Creates the new category
       * Using the user's sent data
       *
       * @param {String} title Title sent by the user
       * @returns {Promise} Promise containing the creation request
       */
      const createCategory = title => {
        const query = {
          title: title
        }

        return ArticleCategory
          .create(query)
      }
      // }}}

      /** We get the title sent by the user as a POST method */
      const title = request.body.title

      /** Now we execute the creation request */
      await createCategory(title)

      /** Then we send to the user a confirmation message, after redirecting him back */
      request.flash('success', 'The category \'' + title + '\' has been created successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Controller: account {{{
  /**
   * Handles the creation of a new administrator account
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   */
  account: async (request, response) => {
    try {
      // Function: createAccount {{{
      /**
       * Creates the new account
       *
       * @param {String} username Username provided by the user
       * @param {String} password Hashed password using bcrypt
       * @returns {Promise} Promise containing the account creation request
       * @see Mongoose
       * @see bcrypt
       */
      const createAccount = (username, password) => {
        /**
         * We get the username provided by the user with the form
         * And we hash the password using bcrypt module
         * Then we setup the query to be used for the account's creation
         */
        const query = {
          created: new Date(),
          username: username,
          password: password
        }

        return Admin
          .create(query)
      }
      // }}}

      /** We hash the given password */
      const username = request.body.username
      const password = await Password.hash(request.body.password)

      /** We execute the creation of the account */
      await createAccount(username, password)

      /**
       * When the account is created, flash a success message
       * After redirecting him back
       */
      request.flash('success', 'The administrator account has been created successfully.')
      response.redirect('back')
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}
