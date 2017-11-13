import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

import MyResourcesView from '../views/MyResources';
import DataInput from '../components/DataInput';

class MyResources extends Component {
  render() {
    const { resources, deleteResource, editResource, showEditForm, isEditFormOpen, hideEditForm } = this.props;
    debugger;
    return (
      <div>
        <MyResourcesView
          resources={resources}
          deleteResource={deleteResource}
          showEditForm={showEditForm}
        />
        <DataInput open={isEditFormOpen} resource={editResource} closeForm={hideEditForm}/>
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
  hideEditForm: bindActionCreators(resourceActions.toggleDataImportForm, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MyResources);