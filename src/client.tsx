import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import reducers from './reducers'
import Layout from './components/Layout'

// This avoids having "property does not exist on type 'Window'"
declare global {
  interface Window { __PRELOADED_STATE__: any }
}

const preloadedState = window.__PRELOADED_STATE__

delete window.__PRELOADED_STATE__ // Allow the passed state to be garbage-collected

const store = createStore(reducers, preloadedState)

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
)
