import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

import MyResourcesView from '../views/MyResources';
import DataInput from '../components/DataInput';

class MyResources extends Component {
  render() {
    const { resources, deleteResource, editResource, showEditForm, isEditFormOpen, hideEditForm, updateResource } = this.props;
    return (
      <div style={{width: '100%'}}>
        <MyResourcesView
          resources={resources}
          deleteResource={deleteResource}
          showEditForm={showEditForm}
        />
        <DataInput open={isEditFormOpen} resource={editResource} submitForm={updateResource} closeForm={hideEditForm}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  resources: resourceSelectors.currentUserResources(state),
  editResource: resourceSelectors.getEditResource(state),
  isEditFormOpen: resourceSelectors.showDataImport(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteResource: bindActionCreators(resourceActions.deleteResource, dispatch),
  showEditForm: bindActionCreators(resourceActions.setEditResource, dispatch),
  hideEditForm: bindActionCreators(resourceActions.toggleDataImportForm, dispatch),
  updateResource: bindActionCreators(resourceActions.updateResource, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MyResources);