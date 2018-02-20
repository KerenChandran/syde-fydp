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
    this.props.addResource(state);
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
  resource: resourceSelectors.getResource(state, props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceInfoEdit));