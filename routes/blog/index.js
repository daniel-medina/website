/** Importing configurations */
import {client, url} from '../../config/database'

/** Importing used NodeJS modules */
import assert from 'assert'

/** Exporting the route */

/** GET HTTP request route
  * ----------------------
  */
module.exports.get = (request, resource) => {
  client.connect(url, (error, db) => {
    assert.equal(null, error)

    let article = []
    let collection = db.collection('articles')
    let data = collection.find({}).sort({ _id: 1 })

    data.forEach((item, error) => {
      assert.equal(null, error)

      article.push(item)
    }, () => {
      /** when the loop ends, we close the database and render the page */
      db.close()

      resource.render('blog/index', {
        title: 'Blog',
        article: article
      })
    })
  })
}
