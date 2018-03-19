import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { requestActions, requestSelectors } from '../modules/request';
import { searchActions } from '../modules/search';
import { userActions, userSelectors } from '../modules/users';

import RequestsView from '../views/RequestsDataTable';
import Sidebar from '../components/RequestSidebar';

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
      requests
    } = this.props;

    if (this.state.loading) {
      return null;
    }

    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{width: '100%', paddingRight: 10}}>
          <RequestsView
            requests={requests}
            showRequestDetails={this.showRequestDetails}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  requests: requestSelectors.getResourceRequests(state),
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