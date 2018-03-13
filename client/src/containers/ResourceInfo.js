import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { userSelectors } from '../modules/users';

import ResourceInfoView from '../views/ResourceInfo';
import { scheduleActions } from '../modules/schedule';

class ResourceInfo extends Component {
  componentDidMount() {
    this.props.fetchResource(this.props.match.params.id);
  }

  handleBackClick = () => (
    this.props.history.push('/resources')
  )

  handleEditClick = () => {
    const { currentUser, history, resource: { resource_id, ownerId }} = this.props;
    if (currentUser.id === ownerId) {
      history.push(`/resources/${resource_id}/edit`);
    }
  }

  handleDeleteClick = () => {
    const { currentUser, deleteResource, resource: { resource_id, ownerId }} = this.props;
    if (currentUser.id === ownerId) {
      deleteResource(resource_id);
      this.handleBackClick();
    }
  }

  handleRequestClick = () => {
    const { history, resource: { resource_id }} = this.props;
    history.push(`/resources/${resource_id}/schedule`)
  }

  render() {
    const { currentUser, resource } = this.props;
    if (resource == null) {
      return null;
    }

    return (
      <ResourceInfoView
        currentUser={currentUser}
        isMyResource={resource.ownerId === currentUser.id}
        resource={resource}
        onBackClick={this.handleBackClick}
        onEditClick={this.handleEditClick}
        onDeleteClick={this.handleDeleteClick}
        onRequestClick={this.handleRequestClick}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  resource: resourceSelectors.getResource(state, props.match.params.id),
  currentUser: userSelectors.currentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteResource: bindActionCreators(resourceActions.deleteResource, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  clearAvailableEvents: bindActionCreators(scheduleActions.clearAvailableEvents, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceInfo));