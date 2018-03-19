import React from 'react';
import classnames from 'classnames';
import './index.css';

export default ({ id, type, balance, onClick, active }) => (
  <div className={classnames('account-box', { 'active': active })} onClick={onClick(id)}>
    <h4>Account No: {id}</h4>
    <h5>{type === 'research' ? "Research" : "Operational"} Account</h5>
    <h5>${balance.toFixed(2)}</h5>
  </div>
);