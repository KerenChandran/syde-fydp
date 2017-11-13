import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

import ResourcesView from '../views/Resources';
import ResourceInfo from '../components/ResourceInfo';
import { toggleResourceDetail } from '../modules/resources/actions';

class AllResources extends Component {
  render() {
    const {
      detailResource,
      resources,
      isDetailResourceOpen,
      setDetailResource,
      toggleResourceDetail
    } = this.props;

    return (
      <div style={{ width: '100%' }}>
        <ResourcesView resources={resources} showDetailsForm={setDetailResource}/>
        <ResourceInfo open={isDetailResourceOpen} resource={detailResource} closeForm={toggleResourceDetail}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resources: resourceSelectors.resources(state),
  detailResource: resourceSelectors.getDetailResource(state),
  isDetailResourceOpen: resourceSelectors.showDetailsResource(state)
});

const mapDispatchToProps = dispatch => ({
  setDetailResource: bindActionCreators(resourceActions.setDetailResource, dispatch),
  toggleResourceDetail: bindActionCreators(resourceActions.toggleResourceDetail, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AllResources);