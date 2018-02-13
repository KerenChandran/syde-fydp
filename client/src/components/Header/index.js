import React from 'react';
import { Link } from 'react-router-dom';
import Search from '../../containers/Search';

import './index.css';

const Header = () => (
  <header className="app-header">
    <Link to="/">
      <span className="app-logo">Share-It</span>
    </Link>
    <div className="app-search">
      <Search />
    </div>
    <div className="app-links" />
  </header>
);


export default Header;
