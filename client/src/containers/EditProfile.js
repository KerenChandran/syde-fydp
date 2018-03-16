import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userActions, userSelectors} from '../modules/users'
import EditProfileView from '../views/EditProfile'

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

        this.faculties = [{"faculty": "Applied Health Sciences"}, {"faculty": "Arts"}, {"faculty": "Engineering"}, {"faculty": "Environment"}, {"faculty": "Mathematics"}, {"faculty": "Science"}];
        this.eng_departments = [{"department": "Chemical Engineering"}, {"department": "Civil & Environmental Engineering"}, {"department": "Electrical & Computer Engineering"}, {"department": "Management Sciences"}, {"department": "Mechanical & Mechatronics Engineering"}, {"department": "Systems Design Engineering"}, {"department": "School of Architecture"}, {"department": "Conrad Business, Entrepreneurship and Technology Centre"}];
        this.science_departments = [{"department": "Biology"}, {"department": "Chemistry"}, {"department": "Earth and Environmental Sciences"}, {"department": "Physics and Astronomy"}, {"department": "School of Optometry and Vision Sciences"}, {"department": "School of Pharmacy"}];
        this.ahs_departments = [{"department": "Kinesiology"}, {"department": "Recreation and Leisure Studies"}, {"department": "School of Public Health and Health Systems"}];
        this.arts_departments = [{"department": "Anthropology"}, {"department": "Classical Studies"}, {"department": "Drama & Speech Communication"}, {"department": "Economics"}, {"department": "English Language and Literature"}, {"department": "Fine Arts"}, {"department": "French Studies"}, {"department": "Germanic and Slavic Studies"}, {"department": "History"}, {"department": "Philosophy"}, {"department": "History"}, {"department": "Philosophy"}, {"department": "Political Science"}, {"department": "Psychology"}, {"department": "Religious Studies"}, {"department": "Sociology and Legal Studies"}, {"department": "Spanish and Latin American Studies"}, {"department": "Balsillie School of International Affairs"}, {"department": "School of Accounting and Finance (SAF)"}];
        this.env_departments = [{"department": "Geography & Environmental Management (GEM)"}, {"department": "Knowledge Integration (KI)"}, {"department": "School of Environment, Enterprise and Development (SEED)"}, {"department": "School of Environment, Resources and Sustainability (SERS)"}, {"department": "School of Planning"}];
        this.math_departments = [{"department": "David R. Cheriton School of Computer Science"}, {"department": "Applied Mathematics"}, {"department": "Combinatorics and Optimization"}, {"department": "Pure Mathematics"}, {"department": "Statistics and Actuarial Science"}];
        
        this.state = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            department: department,
            faculty: faculty,
            role: role,
            department_options: this.departmentList(faculty)
        };
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    };


    handleSelectChange = name => value => {
        this.setState({ [name]: value });
    };

    handleImageUpload = event => (
        this.setState({ image: event.target.files[0] })
    );

    handleFacultyChange = value => {
        this.setState({
            faculty: value,
            department_options: this.departmentList(value)
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { image, ...profile } = this.state;
        const { currentUser, editProfile, history, uploadUserImage } = this.props;
        
        await editProfile(profile);
        if (image != null) {
            await uploadUserImage(image, currentUser.id);
        }
        
        history.push('/resources');
    };

    departmentList = (value) => {
        switch (value) {
            case "Applied Health Sciences": {
                return this.ahs_departments;
            };
            case "Engineering": {
                return  this.eng_departments;
            }
            case "Arts": {
                return this.arts_departments;
            };
            case "Science": {
                return this.science_departments;
            };
            case "Environment": {
                return this.env_departments;
            };
            case "Mathematics": {
                return this.math_departments;
            };
        };
    }

    render() {
        const {currentUserAccounts} = this.props;

        console.log("render ", this.props);
        return (
            <EditProfileView
                {...this.state}
                faculties={this.faculties}
                currentUserAccounts={currentUserAccounts}
                handleChange={this.handleChange}
                handleSelectChange={this.handleSelectChange}
                handleFacultyChange={this.handleFacultyChange}
                handleSubmit={this.handleSubmit}
                handleImageUpload={this.handleImageUpload}
            />
        )
    }
}

const mapStateToProps = state => ({
    currentUser: userSelectors.currentUser(state),
    currentUserAccounts: userSelectors.currentUserAccounts(state)
});

const mapDispatchToProps = dispatch => ({
    editProfile: bindActionCreators(userActions.editProfile, dispatch),
    uploadUserImage: bindActionCreators(userActions.uploadUserImage, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)