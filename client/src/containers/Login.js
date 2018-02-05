import React from 'react'
import { connect } from 'react-redux'

class Login extends React.Component {

    state = {
        username: "",
        password: "",
    };

    render() {
        return (
            <div>Hi</div>
        )
    }
}

const mapStateToProps = state => {
    return {}
}

export default Login