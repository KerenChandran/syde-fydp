import React, { Component } from 'react';
import { connect } from 'react-redux';

import { resourceActions, resourceSelectors } from '../modules/resources'; 

import MyResourcesView from '../views/MyResources';

class MyResources extends Component {
  render() {
    const { resources } = this.props;
    return (
      <MyResourcesView resources={resources}/>
    );
  }
}

const mapStateToProps = (state) => ({
  resources: resourceSelectors.currentUserResources(state)
});

export default connect(mapStateToProps, null)(MyResources);