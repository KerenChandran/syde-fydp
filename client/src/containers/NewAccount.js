import React from 'react'

class NewAccount extends React.Component {

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

export default NewAccount