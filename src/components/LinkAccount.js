import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleSetUser } from '../actions/user';

class LinkAccount extends Component {
  state = {
    user: {
      username: ''
    }
  };

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    this.setState(() => ({
      user: {
        username: ''
      }
    }));
  }

  render() {
    return (
      <div>
        <h1>Link Account</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.user.username} onChange={this.handleChange}/>
          <button>Save</button>
        </form>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(handleSetUser(this.state.user))
  }

  handleChange(e) {
    this.setState({
      user: {
        ...this.state.user,
        username: e.target.value
      }
    })
  }
}

function mapStateToProps () {
  return {};
}

export default connect(mapStateToProps)(LinkAccount)