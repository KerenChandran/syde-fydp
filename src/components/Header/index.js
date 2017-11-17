import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../logo.svg';
import Search from '../../containers/Search';
import { withStyles } from 'material-ui/styles';
import './index.css';

const styles = {
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 40,
    padding: 20,
    color: '#222'
  },
  appLogo: {
    display: 'flex',
    alignItems: 'center',
    flex: '0 0 auto',
    animation: 'App-logo-spin infinite 20s linear',
    height: 40,
    marginRight: 60
  },
  appSearch: {
    display: 'flex',
    justifyContent: 'flex-start',
    flex: '1 0 auto',
    minWidth: 500
  },
  appLinks: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: '1 0 auto',
    marginRight: 10,
    '& $a': {
      padding: 10
    }
  }
}

const Header = ({ classes }) => (
  <header className={classes.appHeader}>
    <img src={logo} className={classes.appLogo} alt="logo" />
    <div className={classes.appSearch}>
      <Search />
    </div>
    <div className={classes.appLinks} />
  </header>
);

export default withStyles(styles)(Header);
