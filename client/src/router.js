import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import Header from './components/Header';

import Home from './containers/Home';
import AllResources from './containers/AllResources';
import MyResources from './containers/MyResources';
import ResourceInfoEdit from './containers/ResourceInfoEdit';
import ResourceInfo from './containers/ResourceInfo';
import RequestResource from './containers/RequestResource';
import RequestInfo from './containers/RequestInfo';
import ScheduleResource from './containers/ScheduleResource';
import ResourceAvailability from './containers/ResourceAvailability';
import Requests from './containers/Requests';
import RequestReview from './containers/RequestReview';

import EditProfile from './containers/EditProfile';
import Login from './containers/Login';
import SignUp from './containers/SignUp';

import { resourceActions } from './modules/resources';
import { userActions } from './modules/users';

class ApplicationRouter extends Component {
  state = {
    loading: localStorage.getItem('id_token') != null
  }
  componentDidMount() {
    if (localStorage.getItem('id_token')) {
      this.props.authUser(this.setState({ loading: false}));
    }
  }

  componentWillUnmount() {
    localStorage.removeItem('id_token');
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    return (
      <ConnectedRouter {...this.props}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/profile/edit" component={EditProfile} />
          <Route exact path="/requests" component={Requests}/>
          <Route exact path="/requests/:id" component={RequestReview}/>
          <div className="App-root">
            <Header />
            <div className="App-content">
              <Route exact path="/resources" component={AllResources} />
              <Switch>
                <Route exact path="/resources/new" component={ResourceInfoEdit} />
                <Route exact path="/resources/myresources" component={MyResources} />
                <Route exact path="/resources/:id" component={ResourceInfo} />
              </Switch>
              <Route exact path="/resources/:id/edit" component={ResourceInfoEdit} />
              <Route exact path="/resources/:id/availability" component={ResourceAvailability} />
              <Route exact path="/resources/:id/schedule" component={ScheduleResource} />
              <Route exact path="/resources/:id/incentive" component={RequestResource} />
              <Route exact path="/resources/:id/request" component={RequestInfo} />
            </div>
          </div>
        </Switch>
      </ConnectedRouter>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchResources: bindActionCreators(resourceActions.fetchResources, dispatch),
  authUser: bindActionCreators(userActions.authUser, dispatch)
});

export default connect(null, mapDispatchToProps)(ApplicationRouter);
