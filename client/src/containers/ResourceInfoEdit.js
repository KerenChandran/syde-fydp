import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

import ResourceInfoEditView from '../views/ResourceInfoEdit';
  
class ResourceInfoEdit extends Component {
  componentDidMount() {
    const id = this.props.match.params.ids;
    if (id >= 0) {
      this.props.fetchResource(id);
    }
  }

  handleBackClick = () => (
    this.props.history.push('/resources')
  )

  handleSubmit = async data => {
    const { saveResource } = this.props;
    const { image, ...resource } = data;
    
    if (image != null) {
      const resource_id = await this.props.fetchSkeletonResource();
      console.log('resource_id', resource_id);
      resource.temp_resource_id = resource_id;
      await this.props.uploadImage(image, resource_id);
    }
    
    saveResource(resource);
  }

  render() {
    const {
      resource,
      updateResource,
      match: { params }
    } = this.props;

    if (params.id >= 0 && resource == null) {
      return null;
    }
    return (
      <ResourceInfoEditView
        resource={resource}
        onBackClick={this.handleBackClick}
        onSubmitClick={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  resource: resourceSelectors.getResource(state, props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch),
  saveResource: bindActionCreators(resourceActions.saveResource, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  fetchSkeletonResource: bindActionCreators(resourceActions.fetchSkeletonResource, dispatch),
  uploadImage: bindActionCreators(resourceActions.uploadImage, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceInfoEdit);