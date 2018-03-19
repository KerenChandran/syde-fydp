import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';

import { ListGroup, ListGroupItem } from 'react-bootstrap';

import './index.css';


class Sidebar extends Component {
  activeLink = () => {
    const { match } = this.props;
  }

  render() {
    const {
      classes,
      isBulkImportOpen,
      showBulkImport,
      submitBulkImport
    } = this.props;
    return (
      <div className="requests-sidebar-root">
        <div className="requests-sidebar-container">
          <ListGroup>
            <NavLink to="/requests" exact className="requests-link" activeClassName="active-link">
              <ListGroupItem>Received Requests</ListGroupItem>
            </NavLink>
            <NavLink to="/requests/myrequests" exact className="requests-link" activeClassName="active-link">
              <ListGroupItem>Sent Requests</ListGroupItem>
            </NavLink>
          </ListGroup>  
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);