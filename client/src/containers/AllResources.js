import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import { resourceActions, resourceSelectors } from '../modules/resources';
import { userSelectors } from '../modules/users';
import { searchActions } from '../modules/search';
import { scheduleActions } from '../modules/schedule';

import ResourcesView from '../views/ResourcesDataTable';
import ResourceDataHeader from '../components/ResourceDataHeader';
import LocationMap from '../components/LocationMap';
import Sidebar from '../components/ResourceSidebar';
import ScheduleFilters from './ScheduleFilters';

const LIST = 'list';
const MAP = 'map';
const GRID = 'grid';

class AllResources extends Component {
  componentDidMount() {
    this.props.fetchResources();
    this.props.clearSchedule();
  }

  componentWillUnmount() {
    this.props.resetSearch();
  }

  state = { view: LIST };

  handleViewToggle = (view) => () => {
    this.setState({ view });
  }

  detailResource = (id) => {
    this.props.history.push(`/resources/${id}`);
  }

  render() {
    const {
      currentUserId,
      resources,
      deleteResource,
    } = this.props;

    const { view } = this.state;

    return (
      <div style={{ display: 'flex', flexGrow: 1, overflowY: 'hidden' }}>
        <Sidebar />
        <div style={{ flexDirection: 'column', flexGrow: 1 }}>
          <ResourceDataHeader view={view} handleViewToggle={this.handleViewToggle} />
          <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '100%', paddingBottom: 150 }}>
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
  fetchResources: bindActionCreators(resourceActions.fetchResources, dispatch),
  clearResources: bindActionCreators(resourceActions.clearResources, dispatch),
  resetSearch: bindActionCreators(searchActions.resetSearch, dispatch),
  clearSchedule: bindActionCreators(scheduleActions.clearSchedule, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllResources);