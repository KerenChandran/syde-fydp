import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

import ResourceInfoEditView from '../views/ResourceInfoEdit';

class ResourceInfoEdit extends Component {
  componentDidMount() {
    const id = this.props.match.params.ids;
    if (id >= 0) {
      this.props.fetchResource(id);
    }
  }

  handleBackClick = () => (
    this.props.history.push('/resources')
  )

  handleSubmit = (state) => {
    const { addResource, history } = this.props;
    addResource(state, history);
  }

  render() {
    const {
      addResource,
      resource,
      updateResource,
      match: { params }
    } = this.props;

    if (params.id >= 0 && resource == null) {
      return null;
    }
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
  addResource: bindActionCreators(resourceActions.addDataImport, dispatch),
  fetchResource: bindActionCreators(resourceActions.fetchResource, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceInfoEdit));