import React, { Component } from 'react'
import { connect } from 'react-redux'

import { handleFetchLibrary } from '../actions/library';
import { handleFetchShuffledItem } from '../actions/shuffledItem';

class Library extends Component {
  constructor() {
    super();
    this.refresh = this.refresh.bind(this);
    this.shuffle = this.shuffle.bind(this);
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
              {/* <ul>
                {this.props.library.releases.map((release, index) => {
                  return <li key={index}>{release.basic_information.title}</li>
                })}
              </ul> */}
              <h3>{this.props.library.releases.length} items in library</h3>
              <div>
                {this.props.shuffledItem && this.props.shuffledItem.id
                  ? (
                    <div>
                      {this.props.shuffledItem.basic_information.artists[0].name}: {this.props.shuffledItem.basic_information.title} ({this.props.shuffledItem.basic_information.formats[0].name})
                    </div>
                  )
                  : null}
              </div>
              <button onClick={this.refresh}>Refresh</button>
              <button onClick={this.shuffle}>Shuffle</button>
            </div>
          )}
      </div>
    );
  }

  refresh() {
    this.props.dispatch(handleFetchLibrary(this.props.user.username, true));
  }

  shuffle() {
    this.props.dispatch(handleFetchShuffledItem(this.props.user.username));
  }
}

function mapStateToProps ({user, library, shuffledItem}) {
  return {
    user,
    library,
    shuffledItem,
    loading: user.fetching || library.fetching
  };
}

export default connect(mapStateToProps)(Library)