import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { userSelectors } from '../modules/users';

import ResourceInfoView from '../views/ResourceInfo';

class ResourceInfo extends Component {
  componentDidMount() {
    this.props.fetchResource(this.props.match.params.id);
  }

  handleBackClick = () => (
    this.props.history.push('/resources')
  )

  handleEditClick = () => {
    const { currentUserId, history, resource: { resource_id, ownerId }} = this.props;
    if (currentUserId == ownerId) {
      history.push(`/resources/${resource_id}/edit`);
    }
  }

  handleDeleteClick = () => {
    const { currentUserId, deleteResource, resource: { resource_id, ownerId }} = this.props;
    if (currentUserId == ownerId) {
      deleteResource(resource_id);
      this.handleBackClick();
    }
  }

  handleRequestClick = () => {
    const { history, resource: { resource_id }} = this.props;
    history.push(`/resources/${resource_id}/schedule`)
  }

  render() {
    const { currentUserId, resource } = this.props;
    if (resource == null) {
      return null;
    }

    return (
      <ResourceInfoView
        currentUserId={currentUserId}
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
  currentUserId: userSelectors.currentUserId(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteResource: bindActionCreators(resourceActions.deleteResource, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceInfo));