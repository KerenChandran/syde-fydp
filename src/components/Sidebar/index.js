import React from 'react';
import NewImport from '../NewImport';
import './index.css';

const Sidebar = () => (
  <div className="App-Sidebar">
    <NewImport />
    <div className="App-Sidebar-filters">
      <div>My Resources</div>
      <div>Available</div>
      <div>Not Available</div>
    </div>
  </div>
);

export default Sidebar;