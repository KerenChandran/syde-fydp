import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Grid, Form, FormGroup, FormControl, ControlLabel, Row, Col, Button} from 'react-bootstrap'
import { bootstrapUtils } from 'react-bootstrap/lib/utils'
import {userActions} from '../modules/users'
import {Redirect} from 'react-router-dom'
import './Login.css'

class SignUp extends React.Component {

    state = {
        email: "",
        password: "",
        redirect: false
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let success = this.props.signUp(this.state, this.props.history);
    };

    render() {
        const {
            email,
            password
        } = this.state;

        return (
            <div id="loginPage">
                <div class="container">
                    <div class="loginBox">
                        <form class="loginContent" onSubmit={this.handleSubmit}>
                            <div class="row" controlId="formHorizontalEmail">
                                <label class="control-label">
                                    Email
                                </label>
                            </div>

                            <div class="row">
                                    <FormControl type="email" placeholder="Email" value={email} onChange={this.handleChange('email')}/>
                            </div>

                            <div class="row" controlId="formHorizontalPassword">
                                <label class="control-label">
                                    Password
                                </label>
                            </div>

                            <div class="row">
                                    <FormControl type="password" placeholder="Password" value={password} onChange={this.handleChange('password')}/>
                            </div>

                            <div class="row" style={{textAlign: 'center', marginTop: 10+'px'}}>
                                    <button type="submit" class="btn btn-primary">Sign up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        )
    }
}

const mapDispatchToProps = dispatch => ({
    signUp: bindActionCreators(userActions.signUp, dispatch)
});


export default connect(null, mapDispatchToProps)(SignUp)
