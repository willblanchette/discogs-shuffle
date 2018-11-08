import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { handleFetchUser } from '../actions/user'
import LinkAccount from './LinkAccount'
import Library from './Library'

class App extends Component {
  componentDidMount () {
    this.props.dispatch(handleFetchUser())
  }

  render() {
    return (
      <Router>
        <Fragment>
          <div>
            {this.props.loading
              ? 'Loading...'
              : <div>
                {this.props.user.username
                  ? <Route path='/' component={Library} />
                  : <Route path='/' component={LinkAccount} />}
              </div>}
          </div>
        </Fragment>
      </Router>
    )
  }
}

function mapStateToProps ({library, user}) {
  return {
    loading: user.fetching,
    user,
  };
}

export default connect(mapStateToProps)(App)