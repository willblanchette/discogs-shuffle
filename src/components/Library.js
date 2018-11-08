import React, { Component } from 'react'
import { connect } from 'react-redux'

import { handleFetchLibrary } from '../actions/library';

class Library extends Component {
  constructor() {
    super();
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(handleFetchLibrary(this.props.user.username));
  }

  render() {
    return (
      <div>
        <h1>Library</h1>
        {this.props.loading
          ? 'Loading...'
          : (
            <div>
              <ul>
                {this.props.library.releases.map((release, index) => {
                  return <li key={index}>{release.basic_information.title}</li>
                })}
              </ul>
              <button onClick={this.refresh}>Refresh</button>
            </div>
          )}
      </div>
    );
  }

  refresh() {
    this.props.dispatch(handleFetchLibrary(this.props.user.username, true));
  }
}

function mapStateToProps ({user, library}) {
  console.log('foo', library);
  return {
    user,
    library,
    loading: user.fetching || library.fetching
  };
}

export default connect(mapStateToProps)(Library)