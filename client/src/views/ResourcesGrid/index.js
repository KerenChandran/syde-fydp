import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

class ResourcesGrid extends Component {
  render() {
    const { resources } = this.props;

    return (
      <BootstrapTable
        pagination
        data={resources}
        options={options}
        selectRow={selectRowOptions}
      >
        <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='category' dataSort caretRender={this.caretRender}>Category</TableHeaderColumn>
        <TableHeaderColumn dataField='company' dataSort caretRender={this.caretRender}>Company</TableHeaderColumn>
        <TableHeaderColumn dataField='model' dataSort caretRender={this.caretRender}>Model</TableHeaderColumn>
        <TableHeaderColumn dataField='location' dataFormat={this.locationFormatter} dataSort caretRender={this.caretRender}>Location</TableHeaderColumn>
        <TableHeaderColumn dataField='available' dataFormat={this.availableFormatter} dataSort caretRender={this.caretRender}>Availability</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default ResourcesGrid;