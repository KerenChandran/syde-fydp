import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Form, FormGroup, FormControl, ControlLabel, Col, Button} from 'react-bootstrap'
import {userActions, userSelectors} from '../modules/users'

class EditProfile extends React.Component {

    state = {
        first_name: "",
        last_name: "",
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
            phone,
            department,
            faculty
        } = this.state;

        return (
            <div>
                <FormGroup controlId="formHorizontalFirstName">
                    <Col componentClass={ControlLabel} sm={2}>
                        First Name
                    </Col>
                    <Col sm={10}>
                        <FormControl type="firstName" placeholder="First Name" value={first_name} onChange={this.handleChange('first_name')} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalLastName">
                    <Col componentClass={ControlLabel} sm={2}>
                        Last Name
                    </Col>
                    <Col sm={10}>
                        <FormControl type="lastName" placeholder="Last Name" value={last_name} onChange={this.handleChange('last_name')} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalLastName">
                    <Col componentClass={ControlLabel} sm={2}>
                        Phone Number
                    </Col>
                    <Col sm={10}>
                        <FormControl type="phone" placeholder="Phone Number" value={phone} onChange={this.handleChange('phone')} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalDepartment">
                    <Col componentClass={ControlLabel} sm={2}>
                        Department
                    </Col>
                    <Col sm={10}>
                        <FormControl type="department" placeholder="department" value={department} onChange={this.handleChange('department')} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalFaculty">
                    <Col componentClass={ControlLabel} sm={2}>
                        Faculty
                    </Col>
                    <Col sm={10}>
                        <FormControl type="faculty" placeholder="Faculty" value={faculty} onChange={this.handleChange('faculty')} />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button type="submit" onClick={this.handleSubmit}>Save</Button>
                    </Col>
                </FormGroup>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: userSelectors.currentUser
});

const mapDispatchToProps = dispatch => ({
    editProfile: bindActionCreators(userActions.editProfile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)