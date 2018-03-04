import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Form, FormGroup, FormControl, ControlLabel, Col, Button} from 'react-bootstrap'
import {userActions} from '../modules/users'

class Login extends React.Component {

    state = {
        email: "",
        password: "",
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };

    handleSubmit = () => {
        this.props.login(this.state)
    };

    render() {
        const {
            email,
            password
        } = this.state;

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
                        <button type="submit" onClick={this.handleSubmit} class="btn btn-primary">Login</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    login: bindActionCreators(userActions.login, dispatch)
});

export default connect(null, mapDispatchToProps)(Login)