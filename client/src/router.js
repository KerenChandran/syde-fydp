import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from './components/Header';

import AllResources from './containers/AllResources';
import MyResources from './containers/MyResources';
import ResourceInfoEdit from './containers/ResourceInfoEdit';
import ResourceInfo from './containers/ResourceInfo';

import EditProfile from './containers/EditProfile';
import Login from './containers/Login';
import MyRequests from './containers/MyRequests';
import Payment from './containers/Payment';

import { resourceActions } from './modules/resources';

class ApplicationRouter extends Component {
  componentDidMount() {
    this.props.fetchResources();
  }

  render() {
    return (
      <Router {...this.props}>
        <div>
          <Header />
          <div className="App-content">
            <Route exact path="/" component={AllResources} />
            <Route exact path="/resources" component={AllResources} />
            <Route path="/resources/view/:id" component={ResourceInfo} />
            <Route path="/resources/edit/:id" component={ResourceInfoEdit} />
            <Route path="/resources/new" component={ResourceInfoEdit} />
            <Route exact path="/resources/myresources" component={MyResources} />
            <Route exact path="/profile/edit" component={EditProfile} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/myrequests" component={MyRequests} />
            <Route exact path="/payment" component={Payment} />
          </div>
        </div>
      </Router>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchResources: bindActionCreators(resourceActions.fetchResources, dispatch)
});

export default connect(null, mapDispatchToProps)(ApplicationRouter);
