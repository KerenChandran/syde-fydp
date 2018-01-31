import React from 'react'

class EditProfile extends React.Component {

    state = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        department: "",
        faculty: "",
        email: ""
    };

    render() {
        return (
            <div>

                <input type="textbox" value={this.state.username} />

            </div>
        )
    }
}

export default EditProfile