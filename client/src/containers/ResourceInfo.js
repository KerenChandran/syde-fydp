import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 
import { userSelectors, userActions } from '../modules/users';

import ResourceInfoView from '../views/ResourceInfo';
import { scheduleActions } from '../modules/schedule';

class ResourceInfo extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    const { fetchResource, fetchUser, match: { params } } = this.props;
    if (params.id >= 1000) {
      this.setState({ loading: false })
    } else {
      this.props.fetchResource(this.props.match.params.id).then(resource => {
        this.props.fetchResourceFiles(this.props.match.params.id);
        this.props.fetchUser(resource.ownerid);
      }).then(() => {
        this.setState({ loading: false });
      });
    }
  }

  handleBackClick = () => (
    this.props.history.push('/resources')
  )

  handleEditClick = () => {
    const { currentUser, history, resource: { resource_id, ownerid }} = this.props;
    if (currentUser.id === ownerid) {
      history.push(`/resources/${resource_id}/edit`);
    }
  }

  handleDeleteClick = () => {
    const { currentUser, deleteResource, resource: { resource_id, ownerid }} = this.props;
    if (currentUser.id === ownerid) {
      deleteResource(resource_id);
      this.handleBackClick();
    }
  }

  handleRequestClick = () => {
    const { resource, saveResource } = this.props;
    saveResource(resource);
  }

  render() {
    const { currentUser, resource, owner } = this.props;
    if (!resource || !owner || this.state.loading) {
      return null;
    }

    const files = resource.file_information && resource.file_information.misc_file ? resource.file_information.misc_file : [];
    const images = resource.file_information && resource.file_information.resource ? resource.file_information.resource : [];

    return (
      <ResourceInfoView
        currentUser={currentUser}
        isMyResource={resource.ownerid === currentUser.id}
        resource={resource}
        owner={owner}
        images={images}
        files={files}
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
  currentUser: userSelectors.currentUser(state),
  owner: userSelectors.getOwnerByResource(state, props.match.params.id),
  images: resourceSelectors.getResourceImages(state, props.match.params.id),
  files: resourceSelectors.getResourceFiles(state, props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  deleteResource: bindActionCreators(resourceActions.deleteResource, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  clearAvailableEvents: bindActionCreators(scheduleActions.clearAvailableEvents, dispatch),
  saveResource: bindActionCreators(resourceActions.saveResource, dispatch),
  fetchUser: bindActionCreators(userActions.fetchUser, dispatch),
  fetchResourceFiles: bindActionCreators(resourceActions.fetchResourceFiles, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceInfo));
