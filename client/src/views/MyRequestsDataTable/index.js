import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, ButtonGroup, Glyphicon, Table } from 'react-bootstrap';
import ScheduleFIlters from '../../containers/ScheduleFilters';

import './index.css';

class RequestsDataTable extends Component {
  handleRowDoubleClick = (row) => {
    this.props.showRequestDetails(row.id);
  }

  renderShowsTotal = (start, to, total) => (
    <span style={{ marginRight: 20 }}>{start} - {to} of {total} Requests</span>
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
    const { requests } = this.props;
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
      defaultSortName: 'model',
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
        trClassName="request-table-row"
      >
        <TableHeaderColumn dataField='id' isKey hidden>ID</TableHeaderColumn>
        <TableHeaderColumn dataSort dataField='owner_name'>Owner Name</TableHeaderColumn>
        <TableHeaderColumn dataSort dataField='model'>Model</TableHeaderColumn>
        <TableHeaderColumn dataSort dataField='request_status'>Status</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default RequestsDataTable;