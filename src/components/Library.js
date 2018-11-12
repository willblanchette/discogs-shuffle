import React, { Component } from 'react'
import { connect } from 'react-redux'

import { handleFetchLibrary } from '../actions/library';
import { handleFetchShuffledItem, handleSkip } from '../actions/shuffledItem';

const blacklistedFormats = ['All Media'];

class Library extends Component {
  state = {format: ''};

  constructor() {
    super();
    this.refresh = this.refresh.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.skip = this.skip.bind(this);
    this.handleFormatChange = this.handleFormatChange.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(handleFetchLibrary(this.props.user.username));
  }

  render() {
    const formats = [];

    if (!this.props.loading) {
      this.props.library.releases.forEach(r => {
        r.basic_information.formats.forEach(f => {
          if (!formats.includes(f.name) && !blacklistedFormats.includes(f.name)) {
            formats.push(f.name);
          }
        });
      })
    }

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
                      {this.props.shuffledItem.id}:
                      {this.props.shuffledItem.basic_information.artists[0].name}:
                      {this.props.shuffledItem.basic_information.title}
                      ({this.props.shuffledItem.basic_information.formats.map(f => f.name).join(', ')})
                    </div>
                  )
                  : null}
              </div>
              <button onClick={this.refresh}>Refresh</button>
              <button onClick={this.shuffle}>Shuffle</button>
              {this.props.shuffledItem.id && <button onClick={this.skip}>Skip</button>}
              <select value={this.state.format} onChange={this.handleFormatChange}>
                <option value=''>All Formats</option>
                {formats.map((f, index) => <option key={index} value={f}>{f}</option>)}
              </select>
            </div>
          )}
      </div>
    );
  }

  refresh() {
    this.props.dispatch(handleFetchLibrary(this.props.user.username, true));
  }

  shuffle() {
    this.props.dispatch(handleFetchShuffledItem(this.props.user.username, this.state.format));
  }

  skip() {
    this.props.dispatch(handleSkip(this.props.shuffledItem));
    this.shuffle();
  }

  handleFormatChange(e) {
    this.setState({format: e.target.value});
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