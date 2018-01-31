import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

import ResourceInfoEditView from '../views/ResourceInfoEdit';

class ResourceInfoEdit extends Component {
  handleBackClick = () => (
    this.props.history.push('/resources')
  )

  handleSubmit = (state) => {
    const { addResource, updateResource } = this.props;
    state.id = state.id > -1 ? state.id : -1;

    if (state.id > -1) {
      updateResource(state);
    } else {
      addResource(state);
    }
    
    this.handleBackClick();
  }

  render() {
    const {
      addResource,
      resource,
      updateResource
    } = this.props;

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
  resource: resourceSelectors.getEditResource(state, props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch),
  updateResource: bindActionCreators(resourceActions.updateResource, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceInfoEdit));