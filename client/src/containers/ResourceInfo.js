import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { userSelectors } from '../modules/users';

import ResourceInfoView from '../views/ResourceInfo';

class ResourceInfo extends Component {
  handleBackClick = () => (
    this.props.history.push('/resources')
  )

  handleEditClick = () => {
    const { currentUserId, history, resource: { id, ownerId }} = this.props;
    if (currentUserId == ownerId) {
      history.push(`/resources/edit/${id}`);
    }
  }

  handleDeleteClick = () => {
    const { currentUserId, deleteResource, resource: { id, ownerId }} = this.props;
    if (currentUserId == ownerId) {
      deleteResource(id);
      this.handleBackClick();
    }
  }

  render() {
    const { currentUserId, resource } = this.props;
    return (
      <ResourceInfoView
        currentUserId={currentUserId}
        resource={resource}
        onBackClick={this.handleBackClick}
        onEditClick={this.handleEditClick}
        onDeleteClick={this.handleDeleteClick}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  resource: resourceSelectors.getDetailResource(state, props.match.params.id),
  currentUserId: userSelectors.currentUserId(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteResource: bindActionCreators(resourceActions.deleteResource, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceInfo));