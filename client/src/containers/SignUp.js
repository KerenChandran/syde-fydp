import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Form, FormGroup, FormControl, ControlLabel, Col, Button} from 'react-bootstrap'
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
                        <Button type="submit" onClick={this.handleSubmit}>Sign in</Button>
                    </Col>
                </FormGroup>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    signUp: bindActionCreators(userActions.signUp, dispatch)
});


export default connect(null, mapDispatchToProps)(SignUp)
