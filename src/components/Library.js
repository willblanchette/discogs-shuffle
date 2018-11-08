import React, { Component } from 'react'
import { connect } from 'react-redux'

import { handleFetchLibrary } from '../actions/library';

class Library extends Component {
  componentDidMount () {
    this.props.dispatch(handleFetchLibrary(this.props.user.username))
  }

  render() {
    return (
      <div>
        <h1>Library</h1>
        {this.props.loading
          ? 'Loading...'
          : (<ul>
              {this.props.library.releases.map((release, index) => {
                return <li key={index}>{release.basic_information.title}</li>
              })}
            </ul>)}
      </div>
    );
  }
}

function mapStateToProps ({user, library}) {
  return {
    user,
    library,
    loading: user.fetching || !library || library.fetching
  };
}

export default connect(mapStateToProps)(Library)