import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Form, FormGroup, FormControl, ControlLabel, Col, Button} from 'react-bootstrap'
import Select, { Creatable } from 'react-select'
import {userActions, userSelectors} from '../modules/users'
import AccountInput from '../components/AccountInput'
import './EditProfile.css'

class EditProfile extends React.Component {

    constructor(props) {
    super(props);

    const {
        first_name,
        last_name,
        email,
        phone,
        department,
        faculty,
        role
    } = props.currentUser;

    this.state = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        department: department,
        faculty: faculty,
        role: role,
        department_options: []
        };
    this.faculties = [{"faculty": "Applied Health Sciences"}, {"faculty": "Arts"}, {"faculty": "Engineering"}, {"faculty": "Environment"}, {"faculty": "Mathematics"}, {"faculty": "Science"}];
    this.eng_departments = [{"department": "Chemical Engineering"}, {"department": "Civil & Environmental Engineering"}, {"department": "Electrical & Computer Engineering"}, {"department": "Management Sciences"}, {"department": "Mechanical & Mechatronics Engineering"}, {"department": "Systems Design Engineering"}, {"department": "School of Architecture"}, {"department": "Conrad Business, Entrepreneurship and Technology Centre"}];
    this.science_departments = [{"department": "Biology"}, {"department": "Chemistry"}, {"department": "Earth and Environmental Sciences"}, {"department": "Physics and Astronomy"}, {"department": "School of Optometry and Vision Sciences"}, {"department": "School of Pharmacy"}];
    this.ahs_departments = [{"department": "Kinesiology"}, {"department": "Recreation and Leisure Studies"}, {"department": "School of Public Health and Health Systems"}];
    this.arts_departments = [{"department": "Anthropology"}, {"department": "Classical Studies"}, {"department": "Drama & Speech Communication"}, {"department": "Economics"}, {"department": "English Language and Literature"}, {"department": "Fine Arts"}, {"department": "French Studies"}, {"department": "Germanic and Slavic Studies"}, {"department": "History"}, {"department": "Philosophy"}, {"department": "History"}, {"department": "Philosophy"}, {"department": "Political Science"}, {"department": "Psychology"}, {"department": "Religious Studies"}, {"department": "Sociology and Legal Studies"}, {"department": "Spanish and Latin American Studies"}, {"department": "Balsillie School of International Affairs"}, {"department": "School of Accounting and Finance (SAF)"}];
    this.env_departments = [{"department": "Geography & Environmental Management (GEM)"}, {"department": "Knowledge Integration (KI)"}, {"department": "School of Environment, Enterprise and Development (SEED)"}, {"department": "School of Environment, Resources and Sustainability (SERS)"}, {"department": "School of Planning"}];
    this.math_departments = [{"department": "David R. Cheriton School of Computer Science"}, {"department": "Applied Mathematics"}, {"department": "Combinatorics and Optimization"}, {"department": "Pure Mathematics"}, {"department": "Statistics and Actuarial Science"}];
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };


    handleSelectChange = name => value => {
        this.setState({ [name]: value });
    };

    handleFacultyChange = value => {
        let department_options = [];

        // change faculty options to the departments for that faculty
        switch (value) {
            case "Applied Health Sciences": {
                department_options = this.ahs_departments;
                break;
            };
            case "Engineering": {
                department_options = this.eng_departments;
                break;
            };
            case "Arts": {
                department_options = this.arts_departments;
                break;
            };
            case "Science": {
                department_options = this.science_departments;
                break;
            };
            case "Environment": {
                department_options = this.env_departments;
                break;
            };
            case "Mathematics": {
                department_options = this.math_departments;
                break;
            };
        };

        this.setState({faculty: value, department_options});
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.editProfile(this.state, this.props.history);
    };

    render() {
        const {
            first_name,
            last_name,
            email,
            phone,
            department,
            faculty,
            role,
            department_options
        } = this.state;

        const {currentUserAccounts} = this.props;

        console.log("render ", this.props);
        return (
            <div id="editProfile">
                <div class="editProfileBox">
                    <form class="profileFormContent" onSubmit={this.handleSubmit}>
                        <div class="row" controlId="formHorizontalFirstName">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                First Name
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="firstName" placeholder="First Name" value={first_name} onChange={this.handleChange('first_name')} />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalLastName">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Last Name
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="lastName" placeholder="Last Name" value={last_name} onChange={this.handleChange('last_name')} />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalEmail">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Email
                            </label>
                            <div class="col-sm-6">
                                <FormControl readOnly type="email" placeholder="Email" value={email} onChange={this.handleChange('email')} />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalPhoneNumber">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Phone Number
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="phone" placeholder="Phone Number" value={phone} onChange={this.handleChange('phone')} />
                            </div>
                        </div>


                        <div class="row" controlId="formHorizontalFaculty">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Faculty
                            </label>
                            <div class="col-sm-6">
                                <Select simpleValue value={faculty} onChange={this.handleFacultyChange} options={this.faculties} labelKey="faculty" valueKey="faculty" />

                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalDepartment">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Department
                            </label>
                            <div class="col-sm-6">
                                <Select simpleValue value={department} onChange={this.handleSelectChange('department')} options={department_options} labelKey="department" valueKey="department" />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalRole">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Role
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="role" placeholder="Role" value={role} onChange={this.handleChange('role')} />
                            </div>
                        </div>


                        {
                            currentUserAccounts.map((account) => (
                                <AccountInput key={account.id} {...account}/>
                            ))
                        }

                        <div class="row">
                            <div class="container" style={{textAlign: 'center', marginTop: 10+'px'}}>
                                <button class="btn btn-primary" type="submit" onClick={this.handleSubmit}>Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }S
}

const mapStateToProps = state => ({
    currentUser: userSelectors.currentUser(state),
    currentUserAccounts: userSelectors.currentUserAccounts(state)
});

const mapDispatchToProps = dispatch => ({
    editProfile: bindActionCreators(userActions.editProfile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)