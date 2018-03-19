import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { userActions } from '../../modules/users';

import Search from '../../containers/Search';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

import './index.css';

class Header extends Component {
  logout = () => {
    this.props.logout();
  }

  editProfile = () => {
      this.props.history.push("/profile/edit");
  }

  render() {
    const { pathname } = this.props.location;
    return (
      <header className='app-header'>
        <Link to="/resources" style={{marginTop:5+'px'}}>
            <span className="app-logo"><strong>ShareIt</strong></span>
        </Link>
        <div className="app-search">
          <Search />
        </div>
        <div className="app-links" style={{paddingTop:5+'px'}}>
            {
                (pathname.includes("requests")) ? (
                    <Link to="/resources">
                      <span className="app-logo" id="requests-link"><strong>Resources</strong></span>
                  </Link>
                ) : (
                    <Link to="/requests">
                      <span className="app-logo" id="requests-link"><strong>Requests</strong></span>
                  </Link>
                )
            }
            <div style={{marginTop:5+'px'}}>
            <DropdownButton
                title={<span class="glyphicon glyphicon-user"></span>}
                pullRight
                style={{border:0, backgroundColor:'#F6F8FC'}}
            >
                <MenuItem onClick={this.editProfile}>Edit Profile</MenuItem>
                <MenuItem onClick={this.logout}>Logout</MenuItem>
            </DropdownButton>
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