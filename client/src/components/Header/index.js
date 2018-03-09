import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Search from '../../containers/Search';

import { Button } from 'react-bootstrap';

import './index.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userActions } from '../../modules/users';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/fontawesome-free-solid';

class Header extends Component {
  logout = () => {
    this.props.logout();
  }

  requests = () => {
    this.props.history.push('/requests');
  }

  render() {
    return (
      <header className="app-header">
        <Link to="/resources">
          <span className="app-logo">Share-It</span>
        </Link>
        <div className="app-search">
          <Search />
        </div>
        <div className="app-links">
          <Button onClick={this.requests}>
            <FontAwesomeIcon icon={faBell}  />
          </Button>
          <Button onClick={this.logout}>Logout</Button>
        </div>
      </header>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(userActions.logout, dispatch)
});

export default withRouter(connect(null, mapDispatchToProps)(Header));