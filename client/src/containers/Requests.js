import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { requestActions } from '../modules/request';
import { searchActions } from '../modules/search';
import { userSelectors } from '../modules/users';

import RequestsView from '../views/RequestsDataTable';
import { requestSelectors } from '../modules/request';

class MyResources extends Component {
  state = {
    loadingResources: true,
    loadingRequests: true
  }

  componentDidMount() {
    const { currentUserId, fetchRequests, fetchResources } = this.props;
    fetchResources(() => this.setState({
      loadingResources: false
    }));
    fetchRequests(currentUserId, () => {
      this.setState({
        loadingRequests: false
      })
    });
  }

  // componentWillUnmount() {
  //   this.props.clearResources();
  //   this.props.clearRequests();
  // }

  showRequestDetails = (id) => {
    this.props.history.push(`/requests/${id}`);
  }

  render() {
    const {
      currentUserId,
      resources,
      requests
    } = this.props;
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
  requests: requestSelectors.getRequests(state),
  resources: resourceSelectors.currentUserResources(state),
  currentUserId: userSelectors.currentUserId(state)
});

const mapDispatchToProps = (dispatch) => ({
  fetchResources: bindActionCreators(resourceActions.fetchResources, dispatch),
  fetchRequests: bindActionCreators(requestActions.fetchRequests, dispatch),
  clearResources: bindActionCreators(resourceActions.clearResources, dispatch),
  clearRequests: bindActionCreators(requestActions.clearRequests, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MyResources);