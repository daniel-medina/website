import React from 'react'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'

import Layout from './components/Layout'

const routes = (store: any, context: any, request: any, response: any) => {
  return (
  <Provider store={store}>
      <StaticRouter location={request.url} context={context}>
        <Layout />
      </StaticRouter>
    </Provider>
  )
}
export default routes
