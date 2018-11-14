import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { handleFetchUser } from '../actions/user'

import Library from './Library'
import Settings from './Settings';

class App extends Component {
  componentDidMount () {
    this.props.dispatch(handleFetchUser())
  }

  render() {
    return (
      <Router>
        <Fragment>
          <div>
            <ul>
              <li><Link to='/'>Library</Link></li>
              <li><Link to='/settings'>Settings</Link></li>
            </ul>
            {this.props.loading
              ? 'Loading...'
              : <div>
                  {this.props.user.username
                    ? <Fragment>
                        <Route path='/' exact component={Library} />
                        <Route path='/settings' component={Settings} />
                      </Fragment>
                    : <Switch>
                        <Route path='/settings' component={Settings} />
                        <Redirect from='/' to='/settings' />
                      </Switch>}
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