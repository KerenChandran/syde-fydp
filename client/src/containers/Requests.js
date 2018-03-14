import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { requestActions } from '../modules/request';
import { searchActions } from '../modules/search';
import { userActions, userSelectors } from '../modules/users';

import RequestsView from '../views/RequestsDataTable';
import { requestSelectors } from '../modules/request';

class Requests extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    const { currentUserId, fetchRequests, fetchResources, fetchUsers } = this.props;
    console.log('currentUserId', currentUserId);
    Promise.all([fetchResources(), fetchRequests(currentUserId), fetchUsers()]).then(() => this.setState({ loading: false }));
  }


  showRequestDetails = (id) => {
    this.props.history.push(`/requests/${id}`);
  }

  render() {
    const {
      currentUserId,
      resources,
      requests
    } = this.props;

    if (this.state.loading) {

    }

    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <RequestsView
          resources={resources}
          requests={requests}
          showRequestDetails={this.showRequestDetails}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  requests: requestSelectors.getResourceRequests(state),
  resources: resourceSelectors.currentUserResources(state),
  currentUserId: userSelectors.currentUserId(state)
});

const mapDispatchToProps = (dispatch) => ({
  fetchResources: bindActionCreators(resourceActions.fetchResources, dispatch),
  fetchRequests: bindActionCreators(requestActions.fetchRequests, dispatch),
  fetchUsers: bindActionCreators(userActions.fetchUsers, dispatch),
  clearResources: bindActionCreators(resourceActions.clearResources, dispatch),
  clearRequests: bindActionCreators(requestActions.clearRequests, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Requests);