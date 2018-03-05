import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { userSelectors } from '../modules/users';
import { searchActions } from '../modules/search';

import ResourcesView from '../views/ResourcesDataTable';
import Sidebar from '../components/ResourceSidebar';

class MyResources extends Component {
  componentDidMount() {
    this.props.resetSearch();
  }

  detailResource = (id) => {
    this.props.history.push(`/resources/${id}`);
  }

  // editResource = (id) => {
  //   this.props.history.push(`/resources/edit/${id}`);
  // }

  render() {
    const {
      currentUserId,
      resources
    } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{width: '100%'}}>
          <ResourcesView
            currentUserId={currentUserId}
            resources={resources}
            showDetailsForm={this.detailResource}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  resources: resourceSelectors.currentUserResources(state),
  currentUserId: userSelectors.currentUserId(state)
});

const mapDispatchToProps = (dispatch) => ({
  resetSearch: bindActionCreators(searchActions.resetSearch, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyResources));