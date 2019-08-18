import React from 'react'
import { Helmet } from 'react-helmet'

class Home extends React.Component {
  exampleMethod() {
    console.log('JS is running')
  }

  head() {
    return(
      <Helmet>
        <title>Home !</title>
      </Helmet>
    )
  }

  render() {
    return (
      <div>
        {this.head()}
        <h1>Test</h1>
        <button onClick={() => this.exampleMethod()}>Console log</button>
      </div>
    )
  }
}

export default Home
