module.exports = {
  postBlog: (request, response, next) => {
    // let url = request.body.url
    let title = request.body.title
    // let content = request.body.content

    if (title.length > 5) {
      next()
    } else {
      response.send('The title\'s length isn\'t long enough.')
    }
  }
}
