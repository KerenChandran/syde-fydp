import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Form, FormGroup, FormControl, ControlLabel, Col, Button} from 'react-bootstrap'
import {userActions, userSelectors} from '../modules/users'

class EditProfile extends React.Component {

    state = {
        first_name: "",
        last_name: "",
        email: currentUser.email,
        phone: "",
        department: "",
        faculty: "",
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };

    handleSubmit = () => {
        this.props.editProfile(this.state)
    };

    render() {
        const {
            first_name,
            last_name,
            email,
            phone,
            department,
            faculty
        } = this.state;

        return (
            <div class="container">
                <div class="row" controlId="formHorizontalFirstName">
                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        First Name
                    </label>
                    <div class="col-sm-4">
                        <FormControl type="firstName" placeholder="First Name" value={first_name} onChange={this.handleChange('first_name')} />
                    </div>

                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Last Name
                    </label>
                    <div class="col-sm-4">
                        <FormControl type="lastName" placeholder="Last Name" value={last_name} onChange={this.handleChange('last_name')} />
                    </div>
                </div>

                <div class="row" controlId="formHorizontalLastName">
                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Email
                    </label>
                    <div class="col-sm-4">
                        <FormControl type="email" placeholder="Email" value={email} onChange={this.handleChange('email')} />
                    </div>

                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Phone Number
                    </label>
                    <div class="col-sm-4">
                        <FormControl type="phone" placeholder="Phone Number" value={phone} onChange={this.handleChange('phone')} />
                    </div>
                </div>

                <div class="row" controlId="formHorizontalDepartment">
                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Department
                    </label>
                    <div class="col-sm-4">
                        <FormControl type="department" placeholder="Department" value={department} onChange={this.handleChange('department')} />
                    </div>

                    <label class="col-sm-2 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                        Faculty
                    </label>
                    <div class="col-sm-4">
                        <FormControl type="faculty" placeholder="Faculty" value={faculty} onChange={this.handleChange('faculty')} />
                    </div>
                </div>

                <div class="row">
                    <div class="container" style={{textAlign: 'center', marginTop: 10+'px'}}>
                        <button class="btn btn-primary" type="submit" onClick={this.handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: userSelectors.currentUser.user
});

const mapDispatchToProps = dispatch => ({
    editProfile: bindActionCreators(userActions.editProfile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)