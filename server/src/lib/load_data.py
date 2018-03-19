"""
    Script to load modified data into database via API endpoints.
"""
import json
import datetime as dt
import random

from dateutil.relativedelta import relativedelta

from utils.db import Cursor
from upload import UploadPipeline
from accounts import TransactionUtil
from schedule import SchedulePipeline

# mandatory fields pulled directly from data
fields = ['Category', 'Model', 'Company']

# dynamic generation of pre-populated values
dynamic_map = {
    "incentive_type": "user_fee",
    "fee_amount": 1.00,
    "fee_cadence": "daily",
    "available": [True],
    "ownerid": [-1],
    "mobile": [False, True],
    "room_number": 6008,
    "rules_restrictions": "",
    "description": "DEN Resource"
}

static_location = {
  "placeid": "ChIJT0wkHAH0K4gRh3y_mDhkEAs",
  "latitude": 43.4729791,
  "longitude": -80.54010269999998,
  "name": "Engineering 5, University Avenue West, Waterloo, ON, Canada"
}


# owner details
owner_map = {
    -1: {
        'first_name': 'Chris',
        'last_name': 'McLellan',
        'phone': '519 888 4567 x123',
        'email': 'chris@resourcesharing.com',
    }, 2: {
        'name': 'Emily',
        'phone': '519 888 4567 x456',
        'email': 'emily@resourcesharing.com',
        'privacy': False,
        'emailPreferred': True,
        'phonePreferred': False
    }, 3: {
        'name': 'Sid',
        'phone': '647 555 1234',
        'email': 'sid@resourcesharing.com',
        'privacy': False,
        'emailPreferred': True,
        'phonePreferred': False
    }, 4: {
        'name': 'Julia',
        'phone': '416 987 4321',
        'email': 'julia@resourcesharing.com',
        'privacy': False,
        'emailPreferred': False,
        'phonePreferred': True
    }, 5: {
        'name': 'Abbey',
        'phone': '905 203 5678',
        'email': 'abbey@resourcesharing.com',
        'privacy': False,
        'emailPreferred': True,
        'phonePreferred': False
    }
}


def generate_data():
    data = json.load(open("App/src/lib/data.json"))

    data = data["resources"]

    # extract fields
    store = []

    for res in data:
        empty = {}

        valid_flag = True

        for fld in fields:
            empty[fld.lower()] = res[fld]

            if "'" in res[fld]:
                valid_flag = False

            if fld == "Fine":
                try:
                    empty["fine"] = empty["fine"].split(" ")[1].strip()
                    empty["fine"] = float(empty["fine"])
                except:
                    empty["fine"] = None

        if valid_flag:
            store.append(empty)

    # dynamically add content
    for res in store:
        for fld in dynamic_map:
            if not isinstance(dynamic_map[fld], list):
                # populate directly
                res[fld] = dynamic_map[fld]

                continue
            
            # randomly generate array index
            idx = random.randint(0,len(dynamic_map[fld])-1)

            res[fld] = dynamic_map[fld][idx]

        res['location'] = static_location

    # include owner details
    for res in store:
        res['owner_information'] = owner_map[res["ownerid"]]

    # output to data_modified.json
    data = {
        "resources": store
    }

    return data


def main():
    crs = Cursor()

    data = generate_data()

    data = data['resources']

    # extract global user information
    user_info = data[0]['owner_information']

    # create a user record for loaded data
    print "creating user record"

    create_user_query = \
    """
        INSERT INTO platform_user (first_name, last_name, email)
        VALUES ('{fnm}', '{lnm}', '{email}')
        RETURNING id;
    """.format(fnm=user_info['first_name'], lnm=user_info['last_name'],
               email=user_info['email'])

    user_id = crs.fetch_first(create_user_query)

    crs.commit()

    # create a basic account for newly created user
    trxn = TransactionUtil(user_id=user_id)

    success = trxn.create_basic_profile()

    if not success:
        return False

    # update all resource records with ownerid
    for res in data:
        res['ownerid'] = user_id
        res.pop("owner_information")

    # upload resource
    print "UPLOADING RESOURCES"

    upload_pipeline = UploadPipeline()

    error_logs = []

    final_resources = []

    for res in data:
        success, errors, df = upload_pipeline.run([res])

        if not success:
            error_logs += errors
            continue

        final_resources.append(df.iloc[0]['resource_id'])

        print "uploaded resource with id: %s" % df.iloc[0]['resource_id']

    # submit availability for all uploaded resources
    expected_dt_format = '%Y-%m-%d %H:%M'

    block_start = dt.datetime.now()

    block_end = block_start + relativedelta(months=12)

    block_start = block_start.strftime(expected_dt_format)

    block_end = block_end.strftime(expected_dt_format)

    availability_blocks = {
        'block_start': block_start,
        'block_end': block_end,
        'block_recurring': {}
    }

    avail_resources = []

    error_logs = []

    for res in final_resources:
        schedule_pipeline = SchedulePipeline(user_id=user_id)

        dp = availability_blocks
        dp['resource_id'] = res

        success, errors = schedule_pipeline.run(
            [dp], init_availability=False, block_scheduling=False)

        if success:
            avail_resources.append(res)

            print "added availability for resource with id: %s" % res

            continue

        error_logs += errors

if __name__ == '__main__':
    main()
