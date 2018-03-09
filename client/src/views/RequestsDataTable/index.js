import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import ScheduleFIlters from '../../containers/ScheduleFilters';

class RequestsDataTable extends Component {
  handleRowDoubleClick = (row) => {
    this.props.showRequestDetails(row.id);
  }

  sortFunc = (a, b, order, sortField) => {
    if (order === 'asc') {
      return b[sortField] - a[sortField];
    }
    return a[sortField] - b[sortField];
  }

  renderShowsTotal = (start, to, total) => (
    <p style={{ marginRight: 20 }}>{start} - {to} of {total} Requests</p>
  )

  availableFormatter = (cell) => (
    cell ? 'Yes' : 'No'
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

  resourceFormat = (cell, row) => {
    console.log('cell', cell, row);
    return this.props.resources[row.resource_id].model;
  }

  render() {
    const { requests, resources } = this.props;
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
        data={requests}
        options={options}
        selectRow={selectRowOptions}
      >
        <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='requester_name'>Borrower</TableHeaderColumn>
        {/* <TableHeaderColumn dataField='model' dataFormat={this.resourceFormat}>Model</TableHeaderColumn> */}
        {/* <TableHeaderColumn dataField='status'>Status</TableHeaderColumn> */}
      </BootstrapTable>
    );
  }
}

export default RequestsDataTable;