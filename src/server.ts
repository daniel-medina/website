import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import bodyParser from 'body-parser'
import { createStore } from 'redux'
import { Helmet } from 'react-helmet'

import reducers from './reducers'
import routes from './routes'

const server = express()
const port = process.env.port || 3000

server.use(bodyParser.json())
server.use(express.static('build/public'))

server.get('*', (request, response) => {
  const store = createStore(reducers)
  const context = {}
  const content = ReactDOMServer.renderToString(routes(store, context, request, response))

  const preloadedState = store.getState()
  const helmet = Helmet.renderStatic()

  const html = `<!doctype html>
  <html>
    <head>
      ${helmet.meta.toString()}
      ${helmet.title.toString()}
    </head>

    <body>
      <div id="root">
        ${content}
      </div>

      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
          /</g,
          '\\u003c'
        )}
      </script>
      <script src="/js/website.js"></script>
    </body>
  </html>`

  response.send(html)
})

server.listen(port, () => {
  console.log(`Server running on port ${port}.`)
})
