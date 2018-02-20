import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import { resourceActions, resourceSelectors } from '../modules/resources';
import { userSelectors } from '../modules/users';
import { searchActions } from '../modules/search';

import ResourcesView from '../views/ResourcesDataTable';
import LocationMap from '../components/LocationMap';
import Sidebar from '../components/ResourceSidebar';

const LIST = 'list';
const MAP = 'map';
const GRID = 'grid';

class AllResources extends Component {
  componentDidMount() {
    this.props.resetSearch();
  }

  state = { view: LIST };

  handleViewToggle = (view) => () => {
    this.setState({ view });
  }

  detailResource = (id) => {
    this.props.history.push(`/resources/view/${id}`);
  }

  render() {
    const {
      currentUserId,
      resources,
      deleteResource,
    } = this.props;

    const { view } = this.state;

    return (
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ButtonGroup>
              <Button bsStyle={view === LIST ? 'primary' : 'default'} onClick={this.handleViewToggle(LIST)}>
                <Glyphicon glyph="list" />
              </Button>
              <Button bsStyle={view === MAP ? 'primary' : 'default'} onClick={this.handleViewToggle(MAP)}>
                <Glyphicon glyph="map-marker" />
              </Button>
            </ButtonGroup>
          </div>
          {
            view === LIST ? (
              <ResourcesView
                resources={resources}
                showDetailsForm={this.detailResource}
                currentUserId={currentUserId}
              />
            ) : (
              <LocationMap
                resources={resources}
                deleteResource={deleteResource}
                showEditForm={this.editResource}
                showDetailsForm={this.detailResource}
                currentUserId={currentUserId}
              />
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: resourceSelectors.filteredResources(state),
  currentUserId: userSelectors.currentUserId(state)
});

const mapDispatchToProps = dispatch => ({
  deleteResource: bindActionCreators(resourceActions.deleteResource, dispatch),
  resetSearch: bindActionCreators(searchActions.resetSearch, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllResources);