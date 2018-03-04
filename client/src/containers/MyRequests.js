import React from 'react'

import { connect } from 'react-redux';
import { notificationsSelectors } from '../modules/notifications';



class MyRequests extends React.Component {

    render() {
        console.log('props', this.props);

        const {
            notifications
        } = this.props;

        return (
            <div>
                {


                    notifications.map(function(notifications) {
                        return (
                            <div>{ notifications.lender_id }</div>
                        )
                    })
                }

            </div>

        )
    }

}

const mapStateToProps = (state) => ({
  notifications: notificationsSelectors.resourceNotifications(state)
});


export default connect(mapStateToProps, null)(MyRequests);