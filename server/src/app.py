"""
    Route definitions and application server instantiation.
"""
import os
import io
import csv
import json

from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from db_utils import Cursor
# from elasticsearch import Elasticsearch

import pdb

# global application instance
app = Flask(__name__, static_url_path='')
bcrypt = Bcrypt(app)

# global database connection
db_conn = Cursor()
crs = db_conn.crs

# global elasticsearch connection
# es = Elasticsearch([
#     {'host':'es', 'port':9200}
# ])

# define upload folder
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# root URL
@app.route("/")
def root():
    return jsonify({"message": "Flask application base."})

# resource upload route
@app.route("/resource_upload", methods=['POST'])
def upload_resource():
    # get request parameters
    data = request.get_json()
    data = data['resource']

    category = data['category']
    model = data['model']
    company = data['company']
    location = data['location']
    faculty = data['faculty']
    description = data['description']
    rules_restrictions = data['rules']
    available = data['available']
    incentive_type = data['incentive']
    mobile = data['mobile']
    application = data['application']
    preferred = 'phone' if data['phonePreferred'] else 'email'
    fee_amount = data['fine']
    owner_id = data['ownerId']

    # clean data
    category = category if category is not None and len(category) > 0 else None
    model = model if model is not None and len(model) > 0 else None
    company = company if company is not None and len(company) > 0 else None
    faculty = faculty if faculty is not None and len(faculty) > 0 else None
    description = description if description is not None \
        and len(description) > 0 else None
    rules_restrictions = rules_restrictions if rules_restrictions is not None \
        and len(rules_restrictions) > 0 else None
    available = available if available is not None else False
    incentive_type = incentive_type if incentive_type is not None \
        and len(incentive_type) > 0 else None
    mobile = mobile if mobile is not None else False
    application = application if application is not None \
        and len(application) > 0 else None
    fee_amount = fee_amount if fee_amount is not None else None

    # create resource record in database
    resource_fields = \
        ['category', 'model', 'company', 'description', 'mobile',
         'available', 'rules_restrictions']

    resource_insert_data = []

    for fld in resource_fields:
        val = 'NULL' if eval(fld) is None else eval(fld)
        resource_insert_data.append("'{val}'".format(val=val))

    crs.execute("""
        INSERT INTO resource ({cols})
        VALUES ({resource_insert_data})
        RETURNING id;
    """.format(cols=",".join(resource_fields), 
               resource_insert_data=",".join(resource_insert_data)))

    resource_id = crs.fetchall()[0][0]

    # create location record in database
    place_id = location['placeId']
    loc_name = location['name']
    latitude = location['lat']
    longitude = location['lng']

    crs.execute("""
        SELECT place_id
        FROM location
        WHERE place_id = '{id}'; 
    """.format(id=place_id))

    result = crs.fetchall()

    if len(result) == 0:
        # missing location so we add tp the database
        location_fields = ['place_id', ('name', 'loc_name'), 'latitude', 
                           'longitude']

        location_insert = []
        cols = []

        for fld in location_fields:
            if isinstance(fld, tuple):
                # first elem is SQL field, second elem is python variable
                val = 'NULL' if eval(fld[1]) is None else eval(fld[1])
                cols.append(fld[0])
            else:
                val = 'NULL' if eval(fld) is None else eval(fld)
                cols.append(fld)

            location_insert.append("'{val}'".format(val=val))

        crs.execute("""
            INSERT INTO location ({cols})
            VALUES ({location_insert_data})
            RETURNING place_id;
        """.format(cols=",".join(cols), 
                   location_insert_data=",".join(location_insert)))

        result = crs.fetchall()

    place_id = result[0][0]

    # add location and resource to join table
    crs.execute("""
        INSERT INTO resource_location (resource_id, location_id)
        VALUES ({rid}, '{lid}')
    """.format(rid=resource_id, lid=place_id))

    # create user and user-resource records
    crs.execute("""
        SELECT id
        FROM platform_user
        WHERE id = {id}
    """.format(id=owner_id))

    res = crs.fetchall()

    if len(res) == 0:
        crs.execute("""
            INSERT INTO platform_user (id)
            VALUES ({id})
        """.format(id=owner_id))

    crs.execute("""
        INSERT INTO resource_user (resource_id, user_id)
        VALUES ({rid}, {uid})
    """.format(rid=resource_id, uid=owner_id))

    db_conn.commit()

    ret_val = {
        'success': True,
        'resource_id': resource_id
    }

    return jsonify(ret_val)

# bulk resource upload
@app.route("/bulk_resource_upload", methods=['POST'])
def bulk_resource_upload():
    # fields for return objects
    flds = ['id', 'category', 'model', 'company', 'location', 'faculty',
            'description', 'rules', 'available', 'incentive', 'mobile',
            'application', 'phonePreferred', 'emailPreferred', 'privacy',
            'email', 'phone', 'ownerId', 'fine', 'name']

    data = request.form

    location = data['location']

    location = json.loads(location)

    # create location record in database
    place_id = location['placeId']
    loc_name = location['name']
    latitude = location['lat']
    longitude = location['lng']

    crs.execute("""
        SELECT place_id
        FROM location
        WHERE place_id = '{id}'; 
    """.format(id=place_id))

    result = crs.fetchall()

    if len(result) == 0:
        # missing location so we add tp the database
        location_fields = ['place_id', ('name', 'loc_name'), 'latitude', 
                           'longitude']

        location_insert = []
        cols = []

        for fld in location_fields:
            if isinstance(fld, tuple):
                # first elem is SQL field, second elem is python variable
                val = 'NULL' if eval(fld[1]) is None else eval(fld[1])
                cols.append(fld[0])
            else:
                val = 'NULL' if eval(fld) is None else eval(fld)
                cols.append(fld)

            location_insert.append("'{val}'".format(val=val))

        crs.execute("""
            INSERT INTO location ({cols})
            VALUES ({location_insert_data})
            RETURNING place_id;
        """.format(cols=",".join(cols), 
                   location_insert_data=",".join(location_insert)))

        result = crs.fetchall()

    place_id = result[0][0]

    f = request.files['resources']
    stream = io.StringIO(f.stream.read().decode('UTF8'), newline=None)
    csv_input = csv.reader(stream, delimiter=',')

    # parse csv input and generate multi-level insert data
    header = None
    body = []

    for row in csv_input:
        if header is None:
            header = row
            continue

        row_vals = []

        for idx in range(0, len(row)):
            if len(row[idx]) > 0:
                row_vals.append(row[idx])
            else:
                row_vals.append('NULL')

        row_data = dict(zip(header, row_vals))

        body.append(row_data)

    # generate resource records for each data point
    for idx, dp in enumerate(body):
        crs.execute("""
            INSERT INTO resource (category)
            VALUES ('{category}')
            RETURNING id;
        """.format(category=dp['category']))

        resource_id = crs.fetchall()[0][0]

        # add location and resource to join table
        crs.execute("""
            INSERT INTO resource_location (resource_id, location_id)
            VALUES ({rid}, '{lid}')
        """.format(rid=resource_id, lid=place_id))

        body[idx]['id'] = resource_id

        # add location information to resource
        body[idx]['location'] = {
            'placeId': place_id,
            'name': loc_name,
            'lat': latitude,
            'lng': longitude
        }

        # add missing fields
        for fld in list(set(flds) - set(body[idx].keys())):
            body[idx][fld] = None

        # hard-coded owner information
        body[idx]['email'] = "john@resourcesharing.com"

        body[idx]['phone'] = "519 888 4567 x123"

        body[idx]['ownerId'] = 1

        body[idx]['name'] = "John"

    ret_val = {
        'resources': body
    }

    return jsonify(ret_val)


# file upload URL
@app.route("/file_upload", methods=['POST'])
def upload_file():
    try:
        file = request.files['image']
        f = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    
        # assume that uploaded file is safe
        file.save(f)

        success = True

    except:
        success = False

    ret_val = {
        "success": success
    }

    return jsonify(ret_val)


@app.route("/create_account", methods=['POST'])
def create_account():
    data = request.get_json()
    email = data['email']
    first_name = data['firstName']
    last_name = data['lastName']
    phone = data['phone']
    pw = bcrypt.generate_password_hash(data['password'])

    # check if account already exists (by email)
    crs.execute("""
        SELECT *
        FROM platform_user
        WHERE email = '{email}'
    """.format(email=email))

    result = crs.fetchall()

    # account already exists
    if len(result) != 0:
        return jsonify({'success': False})

    # add into database, id is auto incremented
    crs.execute("""
        INSERT INTO platform_user (email, first_name, last_name, phone, pw)
        VALUES('{email}', '{first_name}', '{last_name}', '{phone}', '{pw}')
        RETURNING id
    """.format(email=email, first_name=first_name, last_name=last_name, phone=phone, pw=pw))

    result = crs.fetchall()
    account_id = result[0][0]

    db_conn.conn.commit()

    return jsonify({'success': True,
                    'account_id': account_id})

@app.route("/login_user", methods=['POST'])
def login_user():
    data = request.get_json()
    email = data['email']
    pw = data['password']

    crs.execute("""
        SELECT pw
        FROM platform_user
        WHERE email = '{email}'
    """.format(email=email))

    result = crs.fetchall()[0][0]

    validate_pw = bcrypt.check_password_hash(result, pw)

    return jsonify({'success': validate_pw})



if __name__ == "__main__":
    # start application server
    app.run(host="0.0.0.0", port=5000, debug=True)
