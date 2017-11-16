import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { resourceActions, resourceSelectors } from '../modules/resources';
import { userSelectors } from '../modules/users';
import { toggleResourceDetail } from '../modules/resources/actions';
import { searchActions } from '../modules/search';

import ResourcesView from '../views/Resources';
import ResourceInfo from '../components/ResourceInfo';
import DataInput from '../components/DataInput';

class AllResources extends Component {
  componentDidMount() {
    this.props.resetSearch();
  }

  render() {
    const {
      currentUserId,
      detailResource,
      resources,
      isDetailResourceOpen,
      setDetailResource,
      toggleResourceDetail,
      deleteResource,
      editResource,
      showEditForm,
      isEditFormOpen,
      hideEditForm,
      updateResource
    } = this.props;

    return (
      <div style={{ width: '100%' }}>
        <ResourcesView
          resources={resources}
          deleteResource={deleteResource}
          showEditForm={showEditForm}
          showDetailsForm={setDetailResource}
          currentUserId={currentUserId}
        />
        <ResourceInfo open={isDetailResourceOpen} resource={detailResource} closeForm={toggleResourceDetail}/>
        <DataInput open={isEditFormOpen} resource={editResource} submitForm={updateResource} closeForm={hideEditForm}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: resourceSelectors.filteredResources(state),
  detailResource: resourceSelectors.getDetailResource(state),
  isDetailResourceOpen: resourceSelectors.showDetailsResource(state),
  editResource: resourceSelectors.getEditResource(state),
  isEditFormOpen: resourceSelectors.showDataImport(state),
  currentUserId: userSelectors.currentUserId(state)
});

const mapDispatchToProps = dispatch => ({
  setDetailResource: bindActionCreators(resourceActions.setDetailResource, dispatch),
  toggleResourceDetail: bindActionCreators(resourceActions.toggleResourceDetail, dispatch),
  deleteResource: bindActionCreators(resourceActions.deleteResource, dispatch),
  showEditForm: bindActionCreators(resourceActions.setEditResource, dispatch),
  hideEditForm: bindActionCreators(resourceActions.toggleDataImportForm, dispatch),
  updateResource: bindActionCreators(resourceActions.updateResource, dispatch),
  resetSearch: bindActionCreators(searchActions.resetSearch, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllResources);