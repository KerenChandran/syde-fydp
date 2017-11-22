import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import AllResources from './containers/AllResources';
import MyResources from './containers/MyResources';

export default (props) => (
  <Router {...props}>
    <div>
      <Header />
      <div className="App">
        <Sidebar />
        <div className="App-content">
          <Route exact path="/" component={AllResources} />
          <Route exact path="/resources" component={AllResources} />
          <Route exact path="/resources/myresources" component={MyResources} />
        </div>
      </div>
    </div>
  </Router>
);
