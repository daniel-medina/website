/**
 * Admin Middleware
 * Protects the admin panel
 *
 * @author Daniel Medina
 * Date: 07/12/2017
 */

/** Configs imports */
import {
  defaultUsername,
  defaultPassword,
  usernameMinLength,
  usernameMaxLength,
  passwordMinLength,
  passwordMaxLength
} from '../config/admin'
import {
  minArticleTitleLength,
  minArticleCategoryLength,
  maxArticleTitleLength,
  maxArticleCategoryLength
} from '../config/blog'
import {
  colors,
  minProjectTitleLength,
  maxProjectTitleLength,
  minFrameworkNameLength,
  maxFrameworkNameLength,
  minLanguageNameLength,
  maxLanguageNameLength
} from '../config/portfolio'

/** Modules imports */
import slug from 'slug'

/** Models imports */
import Admin from '../models/admin'
import Article from '../models/article'
import Project from '../models/project'
import {ArticleCategory} from '../models/refs/articleCategory'
import {Framework} from '../models/refs/framework'
import {Language} from '../models/refs/language'

/** Libs imports */
import Password from '../lib/password'

/** Setting slug mode */
slug.defaults.mode = 'rfc3986'

/** ALL */
export const all = {
  // Middleware: isAuth {{{
  /**
   * Checks if the user is authenticated as an admin
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  isAuth: async (request, response, next) => {
    try {
      // Function: adminCount {{{
      /**
       * Count the number of admin account
       *
       * @returns {Promise} The count is returned as a promise
       * @see Mongoose
       */
      const adminCount = () => Admin.count({}).exec()
      // }}}
      // Function: createDefaultAdmin {{{
      /**
       * Create a default admin account
       *
       * @returns {Promise} Admin's model creation returned as a promise
       * @see Mongoose
       */
      const createDefaultAdmin = (username, password) => Admin.create({
        created: new Date(),
        username: username,
        password: password
      })
      // }}}
      // Function: checkAuth {{{
      /**
       * Check if the user is logged in as an admin
       *
       * @returns {Response} Redirect the user or pass to the next control
       */
      const checkAuth = () => {
        const check = request.session.admin
        const path = request.url

        /** If he's authenticated */
        if (check) {
        /**
         * If the user is on the authentication page
         * We redirect him to the index of the admin panel
         * Because there is no need for him to login again
         */
          if (path === '/admin/authentication') {
            request.flash('error', 'You are already logged in.')
            response.redirect('/admin')
          } else {
          /** If not, let him go */
            next()
          }
        } else {
        /**
         * If the user is on the disconnect page
         * While not being logged in
         * We redirect him to the index of the website
         */
          if (path === '/admin/disconnect') {
            request.flash('error', 'You can\'t disconnect if you\'re not logged in.')
            response.redirect('/')
          } else {
          /**
           * If the user is not logged in, and trying to access a page that is not
           * The authentication page, redirect him to the proper route
           */
            if (path !== '/admin/authentication') {
              response.redirect('/admin/authentication')
            } else {
              next()
            }
          }
        }
      }
      // }}}

      const adminAmount = await adminCount()

      if (adminAmount === 0) {
        /** If there is no admin in the database, we create a default one */
        const username = defaultUsername
        const password = await Password.hash(defaultPassword)

        await createDefaultAdmin(username, password)

        /**
         * If the first admin has just been created,
         * the user can't possibly be authenticated,
         * so we redirect him to the authentication page
         */
        response.redirect('/admin/authentication')
      } else {
        /** We check if he's authenticated */
        await checkAuth()
      }
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}

/** GET */
export const get = {
  // Middleware: accountIdExist {{{
  /**
   * Verifies that the provided account ID exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  accountIdExist: async (request, response, next) => {
    try {
      // Function: countAccount {{{
      /**
       * Counts the amount of account matching the given id
       *
       * @param {ObjectID} id Id of the account to check
       * @returns {Promise} Promise containing the amount of account matching the id
       * @see Mongoose
       */
      const countAccount = id => {
        const query = {
          _id: id
        }

        return Admin
          .count(query)
          .exec()
      }
      // }}}

      /**
       * We get the amount of account matching the id
       * Then we see if the control may pass or not
       */
      const id = request.params.id
      const amount = await countAccount(id)

      /**
       * If the amount of account matching the ID is not equal to 0
       * It means it does exist and the control may pass
       * Else, we redirect the user back while flashing him an error message.
       */
      if (amount !== 0) {
        next()
      } else {
        request.flash('error', 'The given account\'s id doesn\'t exist in the database.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: accountDeleteSelf {{{
  /**
   * Prevent the administrator from deleting his own account
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  accountDeleteSelf: async (request, response, next) => {
    try {
      // Function: checkSession {{{
      /**
       * Checks if the given account id to delete is equal to the session id
       *
       * @param {ObjectID} id Account id given by the user to delete
       * @param {Object} session Session of the user
       * @returns {Promise} Promise returning a true or false value
       * @see express-session
       */
      const checkSession = (id, session) => {
        return new Promise(function (resolve, reject) {
          if (id === session.admin.id) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      }
      // }}}

      const session = request.session
      const id = request.params.id
      const check = await checkSession(id, session)

      /**
       * If the user is not trying to delete himself, he can pass
       */
      if (!check) {
        next()
      } else {
        /** If he's trying to delete himself, flash him an error message and redirect him back */
        request.flash('error', 'You cannot delete your own account.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: articleCategoryExist {{{
  /**
   * Checks if the chosen article's category exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleCategoryExist: async (request, response, next) => {
    try {
      // Function: countCategory {{{
      /**
       * Returns the amount of category matching the selected category id by the user
       *
       * @async
       * @param {Number} category Chosen category id, sent by the user as POST method
       * @returns {Promise} Promise containing the category count
       * @see Mongoose
       */
      const countCategory = category => {
      /** Returns either 1 or 0, there can't be duplicate ids */
        return ArticleCategory.count({ _id: category }).exec()
      }
      // }}}

      const category = request.body.category
      const count = await countCategory(category)

      if (count !== 0) {
        next()
      } else {
        request.flash('error', 'The selected category doesn\'t exist.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: articleIdExist {{{
  /**
   * Checks if the given article's id exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleIdExist: async (request, response, next) => {
    try {
      // Function: countArticle {{{
      /**
       * Count the number of article matching the given ID
       * It's either 1 or 0 since IDs cannot be duplicated
       *
       * @param {ObjectID} id ObjectID of the article
       * @returns {Promise} Promise containing the count
       * @see Mongoose
       */
      const countArticle = id => {
        const query = {
          _id: id
        }

        return Article
          .count(query)
          .exec()
      }
      // }}}

      const id = request.params.id
      const count = await countArticle(id)

      /**
       * If the article exist (isn't equal to 0)
       * Else, we block the request and return an error
       */
      if (count !== 0) {
        next()
      } else {
        /** If it doesn't exist, redirect the user back and flash him an error message */
        request.flash('error', 'The provided article\'s id doesn\'t exist in the database.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: articleCategoryIdExist {{{
  /**
   * Checks if the given article's id exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleCategoryIdExist: async (request, response, next) => {
    try {
      // Function: countArticleCategory {{{
      /**
       * Count the number of category matching the given ID
       * It's either 1 or 0 since IDs cannot be duplicated
       *
       * @param {ObjectID} id ObjectID of the article
       * @returns {Promise} Promise containing the count
       * @see Mongoose
       */
      const countArticleCategory = id => {
        const query = {
          _id: id
        }

        return ArticleCategory
          .count(query)
          .exec()
      }
      // }}}

      const id = request.params.id
      const count = await countArticleCategory(id)

      /**
         * If the article exist (isn't equal to 0)
         * Else, we block the request and return an error
         */
      if (count !== 0) {
        next()
      } else {
        /** If it doesn't exist, redirect the user back and flash him an error message */
        request.flash('error', 'The provided category\'s id doesn\'t exist in the database.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: frameworkIdExist {{{
  /**
   * Checks the existence of the id of a framework
   * Provided by the user
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  frameworkIdExist: async (request, response, next) => {
    try {
      // Function: check {{{
      /**
       * Returns whether the id exists or not
       *
       * @param {ObjectID} id Id of the framework
       * @returns {Promise} Number of results matching the given id
       */
      const check = id => Framework.count({ _id: id }).exec()
      // }}}

      const id = request.params.id
      const count = await check(id)

      if (count !== 0) {
        next()
      } else {
        request.flash('error', 'The provided framework\'s id doesn\'t exist.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: languageIdExist {{{
  /**
   * Checks the existence of the id of a language
   * Provided by the user
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  languageIdExist: async (request, response, next) => {
    try {
      // Function: check {{{
      /**
       * Returns whether the id exists or not
       *
       * @param {ObjectID} id Id of the language
       * @returns {Promise} Number of results matching the given id
       */
      const check = id => Language.count({ _id: id }).exec()
      // }}}

      const id = request.params.id
      const count = await check(id)

      if (count !== 0) {
        next()
      } else {
        request.flash('error', 'The provided language\'s id doesn\'t exist.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}

/** POST */
export const post = {
  // Middleware: accountUsernameExist {{{
  /**
   * Checks if the account created already exist in the database
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  accountUsernameExist: async (request, response, next) => {
    try {
      // Function: countUsername {{{
      /**
       * Returns the amount of username that matches the provided username
       *
       * @param {String} username Username provided by the user with a form
       * @returns {Promise} Promise containing the amount of account matching the username
       * @see Mongoose
       */
      const countUsername = username => {
        const query = {
          username: username
        }

        return Admin
          .count(query)
      }
      // }}}

      /**
       * We get the username provided by the user
       * Then we get the amount of username that equals it
       * With that amount, we know if it can be created or not
       */
      const username = request.body.username
      const amount = await countUsername(username)

      if (amount === 0) {
        /** If the username doesn't already exist, the user may pass the form */
        next()
      } else {
        /** Else, return him a message */
        request.flash('error', 'The username already exist.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: article {{{
  /**
   * Verify user sent information for the creation of an article
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  article: async (request, response, next) => {
    try {
      const title = request.body.title

      /** If the title's length matches the given configuration */
      if (title.length > minArticleTitleLength && title.length < maxArticleTitleLength) {
        next()
      } else {
        /** Must flash POST data back in order to avoid pissing off the user */
        request.flash('error', 'The title\'s length must be between ' + minArticleTitleLength + ' and ' + maxArticleTitleLength + ' character long.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: articleTitleExist {{{
  /**
   * Checks if the written article's title doesn't already exist
   * Because article's title are used as url, so there must not be any duplicate
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleTitleExist: async (request, response, next) => {
    try {
      // Function: countArticle {{{
      /**
       * Returns the amount of article matching the written title
       * Converted to url
       *
       * @returns {Promise} Promise containing the article count
       * @see Mongoose
       * @see slug
       */
      const countArticle = url => Article.count({ url: url }).exec()
      // }}}

      /** Convertion of the title to its url form, using slug */
      const url = slug(request.body.title)

      /** We then use it to see if it exists */
      let count = await countArticle(url)

      /** If it does not already exist, we can pass */
      if (count === 0) {
        next()
      } else {
        /** Else, we redirect the user back and show him an error message */
        request.flash('error', 'The article\'s title already exist in the database.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: articleCategory {{{
  /**
   * Secure the creation of article category
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleCategory: async (request, response, next) => {
    try {
      const title = request.body.title

      /** If the title matches the configuration's settings */
      if (title.length > minArticleCategoryLength && title.length < maxArticleCategoryLength) {
        next()
      } else {
        /** TODO : flashing POST data back */
        request.flash('error', 'The title\'s length must be between ' + minArticleCategoryLength + ' and ' + maxArticleCategoryLength + ' character long.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: articleCategoryExist {{{
  /**
   * Checks if the chosen article's category exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleCategoryExist: async (request, response, next) => {
    try {
      // Function: countCategory {{{
      /**
       * Returns the amount of category matching the selected category id by the user
       *
       * @async
       * @param {Number} category Chosen category id, sent by the user as POST method
       * @returns {Promise} Promise containing the category count
       * @see Mongoose
       */
      const countCategory = category => {
      /** Returns either 1 or 0, there can't be duplicate ids */
        return ArticleCategory.count({ _id: category }).exec()
      }
      // }}}

      const category = request.body.category
      const count = await countCategory(category)

      if (count !== 0) {
        next()
      } else {
        request.flash('error', 'The selected category doesn\'t exist.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: articleCategoryTitleExist {{{
  /**
   * Checks if the written article's category title doesn't already exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  articleCategoryTitleExist: async (request, response, next) => {
    try {
      // Function: countArticleCategory {{{
      /**
       * Returns the amount of article matching the written title
       * Converted to url
       *
       * @returns {Promise} Promise containing the article count
       * @see Mongoose
       * @see slug
       */
      const countArticleCategory = title => ArticleCategory.count({ title: title }).exec()
      // }}}

      const title = request.body.title

      /** We then use it to see if it exists */
      const count = await countArticleCategory(title)

      /** If it does not already exist, we can pass */
      if (count === 0) {
        next()
      } else {
        /** Else, we redirect the user back and show him an error message */
        request.flash('error', 'The article\'s category title already exist in the database.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: project {{{
  /**
   * Protects the creation of a project
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  project: async (request, response, next) => {
    try {
      const title = request.body.title

      if (title.length > minProjectTitleLength && title.length < maxProjectTitleLength) {
        next()
      } else {
        /** Must flash the data entered by the user in order to avoid pissing him off */
        request.flash('error', 'The project\'s title must be between ' + minProjectTitleLength + ' and ' + maxProjectTitleLength + ' character long.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: projectExist {{{
  /**
   * Checks if the given title is already used by a project
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  projectExist: async (request, response, next) => {
    try {
      // Function: check {{{
      /**
       * Returns the amount of project matching the given title
       *
       * @param {String} title Title given by the user
       * @returns {Promise} Promise containing the amount of project matching the given title
       */
      const check = title => Project.count({ title: title })
      // }}}

      const title = request.body.title
      const count = await check(title)

      /** If there is no project matching the given title, the request may pass */
      if (count === 0) {
        next()
      } else {
        /** If there is already a project using that title, refuse the request */
        request.flash('error', 'The given title is already used.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: framework {{{
  /**
   * Checks values inserted from the user
   * in order to create a new framework
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  framework: async (request, response, next) => {
    try {
      /** We get the user inputs sent via POST */
      const name = request.body.name
      const color = request.body.color

      /** Checks if the given name's length is between the one provided by the configurations */
      if (name.length >= minFrameworkNameLength && name.length <= maxFrameworkNameLength) {
        if (colors.includes(color)) {
          next()
        } else {
          /** Must flash POST data back in order to avoid pissing off the user */
          request.flash('error', 'The chosen color must match one of the available colors.')
          response.redirect('back')
        }
      } else {
        /** Must flash POST data back in order to avoid pissing off the user */
        request.flash('error', 'The name of the framework must be between ' + minFrameworkNameLength + ' and ' + maxFrameworkNameLength + ' character long.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: frameworkExist {{{
  /**
   * Checks if the given framework name already exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  frameworkExist: async (request, response, next) => {
    try {
      // Function: check {{{
      /**
       * Runs the verification
       *
       * @param {String} name Name provided by the user
       * @returns {Promise} Promise containing the amount of framework matching the given name
       * @see Mongoose
       */
      const check = name => Framework.count({ name: name }).exec()
      // }}}

      /** Framework's names are converted to lowercase */
      const name = request.body.name.toLowerCase()
      const count = await check(name)

      /** If there is no framework matching the given name, the user may pass */
      if (count === 0) {
        next()
      } else {
        /** It would be wise to give the user its input back ... */
        request.flash('error', 'There is already a framework using this name.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: language {{{
  /**
   * Checks values inserted from the user
   * in order to create a new language
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  language: async (request, response, next) => {
    try {
      /** We get the user inputs sent via POST */
      const name = request.body.name
      const color = request.body.color

      /** Checks if the given name's length is between the one provided by the configurations */
      if (name.length >= minLanguageNameLength && name.length <= maxLanguageNameLength) {
        if (colors.includes(color)) {
          next()
        } else {
          /** Must flash POST data back in order to avoid pissing off the user */
          request.flash('error', 'The chosen color must match one of the available colors.')
          response.redirect('back')
        }
      } else {
        /** Must flash POST data back in order to avoid pissing off the user */
        request.flash('error', 'The name of the framework must be between ' + minFrameworkNameLength + ' and ' + maxFrameworkNameLength + ' character long.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: languageExist {{{
  /**
   * Checks if the given framework name already exist
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  languageExist: async (request, response, next) => {
    try {
      // Function: check {{{
      /**
       * Runs the verification
       *
       * @param {String} name Name provided by the user
       * @returns {Promise} Promise containing the amount of language matching the given name
       * @see Mongoose
       */
      const check = name => Language.count({ name: name }).exec()
      // }}}

      /** Language's names are converted to lowercase */
      const name = request.body.name.toLowerCase()
      const count = await check(name)

      /** If there is no framework matching the given name, the user may pass */
      if (count === 0) {
        next()
      } else {
        /** It would be wise to give the user its input back ... */
        request.flash('error', 'There is already a language using this name.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // }}}
  // Middleware: account {{{
  /**
   * Checks the variables used to create an administrator account
   *
   * @async
   * @param {HTTP} request
   * @param {HTTP} response
   * @param {HTTP} next
   */
  account: async (request, response, next) => {
    try {
      // Function: checkUsername {{{
      /**
       * Checks if the username is valid
       *
       * @param {String} username Username provided by the user
       * @returns {Promise} Promise giving a true or false response, depending on if the username matches the controls
       */
      const checkUsername = username => {
        return new Promise(function (resolve, reject) {
          const length = username.length

          if (length >= usernameMinLength && length <= usernameMaxLength) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      }
      // }}}
      // Function: checkPassword {{{
      /**
       * Checks if the password is valid
       *
       * @param {String} password Password provided by the user
       * @returns {Promise} Promise giving a true or false response, depending on if the password matches the controls
       */
      const checkPassword = password => {
        return new Promise(function (resolve, reject) {
          const length = password.length

          if (length >= passwordMinLength && length <= passwordMaxLength) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      }
      // }}}

      /** Getting form input */
      const username = request.body.username
      const password = request.body.password

      /** Verifications - both returns boolean */
      const controlUsername = await checkUsername(username)
      const controlPassword = await checkPassword(password)

      /**
       * If the username and password controls returns a true statement
       * Then the verification may pass
       * Else, we return an error to explain the reason of the rejection to the user
       */
      if (controlUsername) {
        if (controlPassword) {
          next()
        } else {
          request.flash('error', 'The password must be between ' + passwordMinLength + ' and ' + passwordMaxLength + ' characters long.')
          response.redirect('back')
        }
      } else {
        request.flash('error', 'The username must be between ' + usernameMinLength + ' and ' + usernameMaxLength + ' characters long.')
        response.redirect('back')
      }
    } catch (error) {
      console.log(error)
    }
  }
  // }}}
}
