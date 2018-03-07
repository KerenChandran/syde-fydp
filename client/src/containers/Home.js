import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Button } from 'react-bootstrap';

class Home extends Component {
  signUp = () => (
    this.props.history.push('/signup')
  )
  
  login = () => (
    this.props.history.push('/login')
  )
  
  render() {
    return (
      <div>
        <h1>Share-It</h1>
        <Button onClick={this.signUp}>Sign Up</Button>
        <Button onClick={this.login}>Login</Button>
      </div>
    );
  }
}

export default withRouter(Home);