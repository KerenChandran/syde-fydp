import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Input from './containers/Input';
import MyResources from './containers/MyResources';
import Search from './containers/Search';

import logo from './logo.svg';

export default (props) => (
  <Router {...props}>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Resource Sharing Platform</h1>
      </header>
      <Route exact path="/" component={MyResources} />
      <Route path="/input" component={Input} />
      <Route path="/search" component={Search} />        
    </div>
  </Router>
);
