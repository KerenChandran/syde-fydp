import React, {Component} from 'react'

import { Button, ButtonToolbar, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';
import Select, { Creatable } from 'react-select'
import AccountInput from '../../components/AccountInput'
import './index.css';

class EditProfileView extends Component {

    showAccount = e => {
        e.preventDefault();
        document.getElementById("accountsDiv").style.display="";
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
            department_options,
            faculties,
            currentUserAccounts,
            handleChange,
            handleSelectChange,
            handleFacultyChange,
            handleSubmit,
            handleImageUpload
        } = this.props;

        return (
            <div id="editProfile">
                <div class="editProfileBox">
                    <form class="profileFormContent" onSubmit={handleSubmit}>
                        <div class="row" controlId="formHorizontalFirstName">
                            <label class="col-sm-4 control-label" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Profile Image
                            </label>
                            <div class="col-sm-6">
                                <FormControl style={{ marginTop: 8 }} type="file" accept="*" onChange={handleImageUpload} />
                            </div>
                        </div>
                        <div class="row" controlId="formHorizontalFirstName">
                            <label class="col-sm-4 control-label required" style={{marginTop: 8 + 'px', textAlign: 'right'}}d>
                                First Name
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="firstName" placeholder="First Name" value={first_name} onChange={handleChange('first_name')} />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalLastName">
                            <label class="col-sm-4 control-label required" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Last Name
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="lastName" placeholder="Last Name" value={last_name} onChange={handleChange('last_name')} />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalEmail">
                            <label class="col-sm-4 control-label required" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Email
                            </label>
                            <div class="col-sm-6">
                                <FormControl readOnly type="email" placeholder="Email" value={email} onChange={handleChange('email')} />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalPhoneNumber">
                            <label class="col-sm-4 control-label required" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Phone Number
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="phone" placeholder="Phone Number" value={phone} onChange={handleChange('phone')} />
                            </div>
                        </div>


                        <div class="row" controlId="formHorizontalFaculty">
                            <label class="col-sm-4 control-label required" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Faculty
                            </label>
                            <div class="col-sm-6">
                                <Select simpleValue value={faculty} onChange={handleFacultyChange} options={faculties} labelKey="faculty" valueKey="faculty" />

                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalDepartment">
                            <label class="col-sm-4 control-label required" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Department
                            </label>
                            <div class="col-sm-6">
                                <Select simpleValue value={department} onChange={handleSelectChange('department')} options={department_options} labelKey="department" valueKey="department" />
                            </div>
                        </div>

                        <div class="row" controlId="formHorizontalRole">
                            <label class="col-sm-4 control-label required" style={{marginTop: 8 + 'px', textAlign: 'right'}}>
                                Role
                            </label>
                            <div class="col-sm-6">
                                <FormControl type="role" placeholder="Role" value={role} onChange={handleChange('role')} />
                            </div>
                        </div>

                        <div class="row" style={{textAlign: 'center', marginTop:10+'px', marginBottom:10+'px'}}>
                            <button class="btn btn-primary" onClick={this.showAccount}>Connect to Unit4 Account</button>
                        </div>

                        <div class="row" id="accountsDiv" style={{display:"none"}}>
                        {
                            currentUserAccounts.map((account) => (
                                <AccountInput key={account.id} {...account}/>
                            ))
                        }
                        </div>

                        <div class="row" style={{textAlign:'center', marginTop:10+'px'}}>
                                <button class="btn btn-primary" type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default EditProfileView;