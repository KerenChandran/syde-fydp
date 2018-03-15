import React, {Component} from 'react';

import { Button, ButtonToolbar, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';
import './index.css';

class HomeView extends Component {
  render() {
    const {email, password, handleChange, handleSubmit, pageAction, footer} = this.props;
    return (
        <div id="loginPage">
          <div class="container">
              <div class="loginBox">
                  <form class="loginContent" onSubmit={handleSubmit}>
                    <div class="row">
                      <h1>{pageAction}</h1>
                    </div>
                      <div class="row" controlId="formHorizontalEmail">
                          <label class="control-label">
                              Email
                          </label>
                      </div>

                      <div class="row">
                              <FormControl type="email" placeholder="Email" value={email} onChange={handleChange('email')}/>
                      </div>

                      <div class="row" controlId="formHorizontalPassword">
                          <label class="control-label">
                              Password
                          </label>
                      </div>

                      <div class="row">
                              <FormControl type="password" placeholder="Password" value={password} onChange={handleChange('password')}/>
                      </div>

                      <div class="row" style={{textAlign: 'center', marginTop: 10+'px'}}>
                              <button type="submit" class="btn btn-primary">{pageAction}</button>
                      </div>

                      {footer}
                  </form>
              </div>
          </div>
      </div>
    )
  }
}

export default HomeView;