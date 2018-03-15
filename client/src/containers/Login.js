import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom';
import {Form, FormGroup, FormControl, ControlLabel, Col, Button} from 'react-bootstrap'
import {userActions} from '../modules/users'
import HomeView from '../views/Home';

class Login extends React.Component {

    // componentWillMount() {
    //     if (localStorage.getItem('id_token') != null) {
    //       this.props.authUser();
    //     }
    //   }

    state = {
        email: "",
        password: "",
        pageAction: "Login"
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.login(this.state);
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
                        Don't have an account? <a href="/signup">Sign up here.</a>
                    </div>
                }
                function={this.login}
            />
        )
    }
}

const mapDispatchToProps = dispatch => ({
    login: bindActionCreators(userActions.login, dispatch),
    authUser: bindActionCreators(userActions.authUser, dispatch),
});

export default connect(null, mapDispatchToProps)(Login)