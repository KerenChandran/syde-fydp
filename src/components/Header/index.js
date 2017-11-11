import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../logo.svg';
import './index.css';

const Header = () => (
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <div className="App-header-links">
      <Link to="/resources">My Resources</Link>
      <Link to="/search">Account</Link>
    </div>
  </header>
);

export default Header;