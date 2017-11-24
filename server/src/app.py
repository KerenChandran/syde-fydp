"""
    Route definitions and application server instantiation.
"""
import os
import io
import csv

from flask import Flask, jsonify, request
from db_utils import connect
from elasticsearch import Elasticsearch

import pdb

# global application instance
app = Flask(__name__, static_url_path='')

# global database connection
db_conn = connect()
crs = db_conn.cursor()

# global elasticsearch connection
es = Elasticsearch([
    {'host':'es', 'port':9200}
])

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
    f = request.files['bulk_upload_file']
    stream = io.StringIO(f.stream.read().decode('UTF8'), newline=None)
    csv_input = csv.reader(stream)

    data = request.get_json()

    location = data['location']

    # create location record if not already present
    place_id = location['placeId']

    crs.execute("""
        SELECT name
        FROM location
        WHERE place_id = '{pid}'
    """.format(pid=place_id))

    res = crs.fetchall()

    return_msg = {
        'success': True
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


if __name__ == "__main__":
    # start application server
    app.run(host="0.0.0.0", port=5000, debug=True)
