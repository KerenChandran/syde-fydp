import React from 'react';

import { Button, ButtonToolbar } from 'react-bootstrap';
import './index.css'

export default ({ login, signUp }) => (
  <div className="home-root">
    <div className="overlay">
      <div className="info-container">
        <div className="info-container-inner">
          <h1 className="text-center">ShareIt</h1>
          <ButtonToolbar className="center-block">
            <Button bsSize="large" onClick={signUp}>Sign Up</Button>
            <Button bsSize="large" bsStyle="primary" onClick={login}>Login</Button>
          </ButtonToolbar>
        </div>
      </div>
    </div>
  </div>
);