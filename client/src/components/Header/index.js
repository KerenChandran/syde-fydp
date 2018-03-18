import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { userActions } from '../../modules/users';

import Search from '../../containers/Search';
import { Button } from 'react-bootstrap';

import './index.css';

class Header extends Component {
  logout = () => {
    this.props.logout();
  }

  render() {
    const { pathname } = this.props.location;
    return (
      <header className='app-header'>
        <Link to="/resources">
          <span className="app-logo">ShareIt</span>
        </Link>
        <div className="app-search">
          <Search />
        </div>
        <div className="app-links" style={{paddingTop:5+'px'}}>
          <Link to="/requests">
            <span className="app-logo">Requests</span>
          </Link>
            <div style={{marginTop:10+'px'}}>
            <a class="dropdown-toggle">
                    <span class="glyphicon glyphicon-user"></span> <span class="caret"></span>
            </a>
             <ul class="dropdown-menu">
                <li><a href="#">Edit Profile</a></li>
                <li><a onClick={this.logout}>Logout</a></li>
             </ul>
            </div>
        </div>
          <script type="javascript">
              $('.dropdown-toggle').dropdown()
          </script>
      </header>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(userActions.logout, dispatch)
});

export default withRouter(connect(null, mapDispatchToProps)(Header));