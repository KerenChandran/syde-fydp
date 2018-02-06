"""
    Test scheduling pipeline by simulating API endpoints.
"""
import json

from ..schedule import SchedulePipeline
from ..utils.db import Cursor

def main():
    """
        Main method for testing initial availability and block schedule
        creation.
    """
    crs = Cursor()

    schedpipe = SchedulePipeline(user_id=1000)

    # upload resource as it does not already exist
    res_upload_query = \
    """
        INSERT INTO resource (id)
        VALUES (1000)
    """

    crs.execute(res_upload_query)

    crs.commit()

    init_availability = {
        'resource_id': 1000, 
        'availability_start': '2018-01-28', 
        'availability_end': '2018-03-28'
    }

    success, errors = schedpipe.run([init_availability], block_scheduling=False)

    message = "INITIAL AVAILABILITY TEST"

    print "\n"
    print message
    print "-" * len(message)

    print "success: %s" % success

    print "errors: %s" % ",".join(errors)

    user_upload_query = \
    """
        INSERT INTO platform_user (id)
        VALUES (1000)
    """

    crs.execute(user_upload_query)

    crs.commit()

    block_scheduling = {
        'resource_id': 1000,
        'block_start': '2018-01-30 13:30',
        'block_end': '2018-01-30 14:30',
        'block_recurring': {
            'cadence': 'weekly',
            'start': '2018-01-30',
            'end': '2018-03-10'
        }
    }

    success, errors = schedpipe.run([block_scheduling], init_availability=False)

    message = "BLOCK SCHEDULING TEST"

    print "\n"
    print message
    print "-" * len(message)

    print "success: %s" % success

    print "errors: %s" % ",".join(errors)

    return True


if __name__ == '__main__':
    main()
