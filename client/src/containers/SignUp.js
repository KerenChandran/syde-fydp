import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Grid, Form, FormGroup, FormControl, ControlLabel, Row, Col, Button} from 'react-bootstrap'
import { bootstrapUtils } from 'react-bootstrap/lib/utils'
import {userActions} from '../modules/users'
import {Redirect} from 'react-router-dom'
import HomeView from '../views/Home';

class SignUp extends React.Component {

    state = {
        email: "",
        password: "",
        pageAction: "Sign Up"
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.signUp(this.state);
    };

    render() {
        const {
            email,
            password,
            pageAction
        } = this.state;

        return (
            <HomeView
                email={email}
                password={password}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                pageAction={pageAction}
                footer={
                    <div class="row" style={{textAlign: 'center'}}>
                        Already have an account? <a href="/login">Log in here</a>.
                    </div>
                }
            />
        )
    }
}

const mapDispatchToProps = dispatch => ({
    signUp: bindActionCreators(userActions.signUp, dispatch)
});


export default connect(null, mapDispatchToProps)(SignUp)
