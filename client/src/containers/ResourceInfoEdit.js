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
    const { image, files, ...resource } = data;
    console.log('info images', image);
    console.log('info files', files);
    console.log('info resource', resource.resource_id);
    let resource_id = resource.resource_id;
    
    if ((image != null || files.length > 0) && resource_id == null) {
      resource_id = await this.props.fetchSkeletonResource();
      resource.temp_resource_id = resource_id;
    }

    if (image != null) {
      await this.props.uploadImage(image, resource_id);
    }

    if (files.length > 0) {
      await this.props.uploadFile(files[0].file, resource_id);
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

    const files = resource.file_information && resource.file_information.misc_file ? resource.file_information.misc_file : [];
    // const files = resource.file_information && resource.file_information.misc_file ? resource.file_information.misc_file : [];

    return (
      <ResourceInfoEditView
        resource={resource}
        files={files}
        onBackClick={this.handleBackClick}
        onSubmitClick={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  resource: resourceSelectors.getResource(state, props.match.params.id),
  files: resourceSelectors.getResourceFiles(state, props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch),
  saveResource: bindActionCreators(resourceActions.saveResource, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch),
  fetchSkeletonResource: bindActionCreators(resourceActions.fetchSkeletonResource, dispatch),
  uploadImage: bindActionCreators(resourceActions.uploadImage, dispatch),
  uploadFile: bindActionCreators(resourceActions.uploadFile, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceInfoEdit);
