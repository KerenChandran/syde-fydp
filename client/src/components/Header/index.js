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

  render() {
    const { pathname } = this.props.location;
    const className = pathname === '/resources' || pathname === '/resources/myresources' ? 'app-header large-header' : 'app-header';
    return (
      <header className={className}>
        <Link to="/resources">
          <span className="app-logo">ShareIt</span>
        </Link>
        <div className="app-search">
          <Search />
        </div>
        <div className="app-links">
          <Link to="/resources">
            <span className="app-logo">Resources</span>
          </Link>
          <Link to="/requests">
            <span className="app-logo">Requests</span>
          </Link>
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