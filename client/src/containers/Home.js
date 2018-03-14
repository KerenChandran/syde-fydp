import React, { Component } from 'react';

import HomeView from '../views/Home';

class Home extends Component {
  signUp = () => (
    this.props.history.push('/signup')
  )
  
  login = () => (
    this.props.history.push('/login')
  )
  
  render() {
    return (
      <HomeView signUp={this.signUp} login={this.login} />
    );
  }
}

export default Home;