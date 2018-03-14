import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

import './index.css';

class ResourcesDataTable extends Component {
  handleRowDoubleClick = (row) => {
    this.props.showDetailsForm(row.resource_id);
  }

  sortFunc = (a, b, order, sortField) => {
    if (order === 'asc') {
      return b[sortField] - a[sortField];
    }
    return a[sortField] - b[sortField];
  }

  renderShowsTotal = (start, to, total) => (
    <p style={{ marginRight: 20 }}>{start} - {to} of {total} resources</p>
  )

  availableFormatter = (cell) => (
    cell ? 'Yes' : 'No'
  )

  firstAvailableFormatter = (cell) => (
    moment(cell).format('YYYY-MM-DD')
  )

  locationFormatter = (cell) => (
    cell.name != null ? cell.name : cell
  )

  caretRender = (order) => {
    if (order === 'asc') {
      return (
        <span className="dropdown">
          <span className="caret" style={{margin: "10px 5px"}}></span>
        </span>
      );
    }

    if (order === 'desc') {
      return (
        <span className="dropup">
          <span className="caret" style={{margin: "10px 5px"}}></span>
        </span>
      );
    }

    return (
      <span className="order">
        <span className="dropup">
          <span className="caret" style={{margin: "10px 0px 10px 5px", color: "rgb(204, 204, 204)"}}></span>
        </span>
        <span className="dropdown">
          <span className="caret" style={{margin: "10px 0px", color: "rgb(204, 204, 204)"}}></span>
        </span>
      </span>
    )
  }

  render() {
    const { resources } = this.props;
    const options = {
      sizePerPage: 25,
      sizePerPageList: [{
        text: '25', value: 25
      }, {
        text: '50', value: 50
      }, {
        text: '100', value: 100
      }],
      paginationShowsTotal: this.renderShowsTotal,
      onRowDoubleClick: this.handleRowDoubleClick,
      defaultSortName: 'category',
      defaultSortOrder: 'asc'
    };

    const selectRowOptions = {
      mode: 'radio',
      clickToSelect: true,
      bgColor: '#f9f9f9',
      hideSelectColumn: true
    };

    return (
      <BootstrapTable
        pagination
        data={resources}
        options={options}
        selectRow={selectRowOptions}
        trClassName="resource-table-row"
      >
        <TableHeaderColumn dataField='resource_id' isKey hidden>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='category' dataSort caretRender={this.caretRender}>Category</TableHeaderColumn>
        <TableHeaderColumn dataField='company' dataSort caretRender={this.caretRender}>Company</TableHeaderColumn>
        <TableHeaderColumn dataField='model' dataSort caretRender={this.caretRender}>Model</TableHeaderColumn>
        <TableHeaderColumn dataField='location' dataFormat={this.locationFormatter} dataSort caretRender={this.caretRender}>Location</TableHeaderColumn>
        <TableHeaderColumn dataField='available' dataFormat={this.availableFormatter} dataSort caretRender={this.caretRender}>Available</TableHeaderColumn>
        <TableHeaderColumn hidden={resources.length && resources[0].first_available == null} dataField='first_available' dataFormat={this.firstAvailableFormatter} dataSort caretRender={this.caretRender}>First Available</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default ResourcesDataTable;