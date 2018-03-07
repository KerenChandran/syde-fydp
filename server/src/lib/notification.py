"""
    Module to handle creation and update of notifications.
"""

from utils.db import Cursor

class NotificationUtil:
    def __init__(self):
        self.crs = Cursor()

        pass

    def create_notification(self, receiver_id, message):
        """
            Main method to create a notification.

            Parameters
            ----------
            receiver_id : {int}
                unique identifier of platform user that notification is being
                sent to.

            message : {str}
                text blog for message being sent as part of the notification
        """
        # create notification
        message = "'{msg}'".format(msg=message if len(message) > 0 else 'NULL')

        notification_insert_query = \
        """
            INSERT INTO notification (message, read_flag)
            VALUES ('{msg}', False)
            RETURNING id;
        """.format(msg=message)

        notification_id = self.crs.fetch_first(notification_insert_query)

        # create a mapping between receiver and the notification
        user_notification_mapping_query = \
        """
            INSERT INTO user_notification (user_id, notification_id)
            VALUES ({uid}, {nid})
        """.format(uid=receiver_id, nid=notification_id)

        self.crs.execute(user_notification_mapping_query)

        self.crs.commit()

        return True, notification_id

    def update_notification(self, notification_id):
        """
            Main method to update an existing notification (i.e. change the
            flag which states whether the notification has been read).

            Parameters
            ----------
            notification_id : {int}
                unique identifier of notification that is to be updated.
        """
        update_notification_query = \
        """
            UPDATE notification
            SET read_flag=True
            WHERE id={nid};
        """.format(nid=notification_id)

        self.crs.execute(update_notification_query)

        self.crs.commit()

        return True

    def get_notifications(self, user_id):
        """
            Main method to retrieve all notifications for a given user.

            Parameters
            ----------
            user_id : {int}
                unique identifier of platform user for which notifications
                need to be retrieved. 
        """
        get_notifications_query = \
        """
            SELECT n.id, n.message, n.read_flag
            FROM notification n
            INNER JOIN user_notification un
                ON n.id = un.notification_id
                AND un.user_id = {uid}
        """.format(uid=user_id)

        notifications = self.crs.fetch_dict(get_notifications_query)

        return True, notifications


if __name__ == '__main__':
    nu = NotificationUtil()
