import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';

import { resourceActions, resourceSelectors } from '../modules/resources';
import { userSelectors } from '../modules/users';
import { searchActions } from '../modules/search';

import ResourcesView from '../views/Resources';
import ResourceInfo from '../components/ResourceInfo';
import DataInput from '../components/DataInput';
import LocationMap from '../components/LocationMap';

import ListIcon from 'material-ui-icons/List';
import MapIcon from 'material-ui-icons/Map';

const LIST = 'list';
const MAP = 'map';

class AllResources extends Component {
  componentDidMount() {
    this.props.resetSearch();
  }

  state = { view: LIST };

  handleViewToggle = (view) => () => {
    this.setState({ view });
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
      addResource,
      updateResource
    } = this.props;

    const { view } = this.state;

    console.log('isDetailResourceOpen', isDetailResourceOpen);
    console.log('isEditFormOpen', isEditFormOpen);

    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton aria-label="List View" onClick={this.handleViewToggle(LIST)}>
            <ListIcon />
          </IconButton>
          <IconButton aria-label="Map View" onClick={this.handleViewToggle(MAP)}>
            <MapIcon />
          </IconButton>
        </div>
        {
          view === LIST ? (
            <ResourcesView
              resources={resources}
              deleteResource={deleteResource}
              showEditForm={showEditForm}
              showDetailsForm={setDetailResource}
              currentUserId={currentUserId}
            />
          ) : (
            <LocationMap
              resources={resources}
              deleteResource={deleteResource}
              showEditForm={showEditForm}
              showDetailsForm={setDetailResource}
              currentUserId={currentUserId}
            />
          )
        }
        <ResourceInfo open={isDetailResourceOpen} resource={detailResource} closeForm={toggleResourceDetail}/>
        <DataInput open={isEditFormOpen} resource={editResource} addResource={addResource} updateResource={updateResource} closeForm={hideEditForm}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: resourceSelectors.filteredResources(state).slice(0, 50),
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
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch),
  updateResource: bindActionCreators(resourceActions.updateResource, dispatch),
  resetSearch: bindActionCreators(searchActions.resetSearch, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllResources);