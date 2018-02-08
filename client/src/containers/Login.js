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
            <div>
                <div>
                <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} sm={2}>
                        Email
                    </Col>
                    <Col sm={10}>
                        <FormControl type="email" placeholder="Email" value={email} onChange={this.handleChange('email')}/>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={2}>
                        Password
                    </Col>
                    <Col sm={10}>
                        <FormControl type="password" placeholder="Password" value={password} onChange={this.handleChange('password')}/>
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button type="submit" onClick={this.handleSubmit}>Login</Button>
                    </Col>
                </FormGroup>
            </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    login: bindActionCreators(userActions.login, dispatch)
});

export default connect(null, mapDispatchToProps)(Login)