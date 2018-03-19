import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { resourceSelectors, resourceActions } from '../modules/resources';
import { scheduleActions, scheduleSelectors } from '../modules/schedule';

import ResourceInfoEditConfirmView from '../views/ResourceInfoEditConfirm';
import { isEmpty } from 'lodash';

class ResourceInfoEditConfirm extends Component {
  componentWillUnmount() {
    this.props.clearSchedule();
  }

  handleCancel = () => {
    this.props.history.push('/resources');
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { addResource, resource, newEvents, submitAvailabilityBlocks } = this.props;
    
    const resource_id = await addResource(resource);
    await submitAvailabilityBlocks(newEvents.map(event => ({
      ...event,
      resource_id
    })));
  }

  render() {
    const { match: { params }, existingResource, resource, existingEvents, newEvents } = this.props;

    return (
      <ResourceInfoEditConfirmView
        resource={resource}
        existingEvents={existingEvents}
        newEvents={newEvents}
        onCancel={this.handleCancel}
        onConfirm={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  existingEvents: scheduleSelectors.getAvailableEvents(state),
  newEvents: scheduleSelectors.getNewAvailableEvents(state),
  resource: resourceSelectors.getNewResource(state)
});

const mapDispatchToProps = dispatch => ({
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch),
  clearSchedule: bindActionCreators(scheduleActions.clearSchedule, dispatch),
  submitAvailabilityBlocks: bindActionCreators(scheduleActions.submitAvailabilityBlocks, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceInfoEditConfirm);