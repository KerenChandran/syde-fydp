import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Grid, Form, FormGroup, FormControl, ControlLabel, Row, Col, Button} from 'react-bootstrap'
import { bootstrapUtils } from 'react-bootstrap/lib/utils'
import {userActions} from '../modules/users'
import {Redirect} from 'react-router-dom'

class SignUp extends React.Component {

    state = {
        email: "",
        password: "",
        redirect: false
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };

    handleSubmit = () => {
        let success = this.props.signUp(this.state);
        if (success) {
            this.setState({redirect: true});
        }
    };

    render() {
        const {
            email,
            password,
            redirect
        } = this.state;


        if (redirect) {
            return <Redirect to='../profile/edit' />;
        }

        return (
            <div class="container">
                <div class="row" controlId="formHorizontalEmail">
                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Email
                    </label>
                    <div class="col-sm-6">
                        <FormControl type="email" placeholder="Email" value={email} onChange={this.handleChange('email')}/>
                    </div>
                </div>

                <div class="row" controlId="formHorizontalPassword">
                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Password
                    </label>
                    <div class="col-sm-6">
                        <FormControl type="password" placeholder="Password" value={password} onChange={this.handleChange('password')}/>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-8" style={{textAlign: 'center', marginTop: 10+'px'}}>
                        <button type="submit" onClick={this.handleSubmit} class="btn btn-primary">Sign up</button>
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
