import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Input from './containers/Input';
import MyResources from './containers/MyResources';
import Search from './containers/Search';

export default (props) => (
  <Router {...props}>
    <div>
      <Header />
      <div className="App">
        <Sidebar />
        <div className="App-content">
          <Route exact path="/" component={MyResources} />
          <Route exact path="/resources" component={MyResources} />
          <Route path="/search" component={Search} />   
        </div>
      </div>
    </div>
  </Router>
);
