import React from 'react'
import { Switch, Route } from 'react-router'

import Home from './Home'

class Layout extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" render={ props => (
          <Home {...props} />
        )} />
      </Switch>
    )
  }
}

export default Layout
