"""
    Route definitions and application server instantiation.
"""
import os
import io
import csv
import json

from flask import Flask, jsonify, request, g
from flask_bcrypt import Bcrypt
from flask_httpauth import HTTPTokenAuth
from flask_login import LoginManager

from lib.upload import UploadPipeline
from lib.user import User
from lib.profile import ProfilePipeline

import pdb


# global application instance
app = Flask(__name__, static_url_path='')
# bcrypt for encryption
bcrypt = Bcrypt(app)
# authentication / login stuff
auth = HTTPTokenAuth('Bearer')
login_manager = LoginManager()
login_manager.init_app(app)

# define upload folder
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# function for authentication
# TODO: Need to verify that token is passed through properly here
@auth.verify_token
def verify_token(token):
    user = User()
    user_info = user.verify_token(token)
    if user_info:
        g.user = user_info
        return True
    else:
        return False

# HELPER METHODS
def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

# root URL
@app.route("/")
def root():
    return jsonify({"message": "Flask application base."})


# single resource upload
@app.route("/resource_upload", methods=['POST'])
def upload_resource():
    # get request parameters
    # assumption: record has ownerId data point
    data = request.get_json()
    data = data['resource']

    # create list of single dictionary
    data = [data]

    # run upload pipeline
    pipeline = UploadPipeline()
    success, errors, df = pipeline.run(data)

    resource_id = df.iloc[0]['resource_id']
 
    ret_val = {
        'success': success,
        'error_logs': errors,
        'resource_id': resource_id
    }

    return jsonify(ret_val)


# bulk resource upload
@app.route("/bulk_resource_upload", methods=['POST'])
def bulk_resource_upload():
    # get single location for all resources
    data = request.form

    location = json.loads(data['location'])

    # parse csv input and generate data points
    f = request.files['resources']
    stream = io.StringIO(f.stream.read().decode('UTF8'), newline=None)
    csv_input = csv.reader(stream, delimiter=',')

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

    # assumption: ownerId data point is present for each record

    for idx, dp in enumerate(body):
        # add location data to each record
        body[idx]['location'] = location

    # run upload pipeline
    pipeline = UploadPipeline()

    success, errors, df = pipeline.run(body)

    # TODO: handle resource_ids returned by run method

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


@app.route("/new_user", methods=['POST'])
def new_user():
    #pdb.set_trace()

    data = request.get_json()
    data = data['user']
    email = data['email']
    password_hash = bcrypt.generate_password_hash(data['password'])

    # save user in database
    save_user = User()
    user_id = save_user.save(email, password_hash)

    # login user
    if user_id is None:
        auth_token = None
        user = None
    # return token
    else:
        auth_token = save_user.generate_auth_token(user_id)
        user = save_user.get_user_from_id(user_id)

    ret_val = {
        "token": auth_token,
        "user": user
    }

    return jsonify(ret_val)

@app.route("/edit_profile", methods=['POST'])
@auth.login_required
def edit_profile():
    data = request.get_json()
    data = data['profile']

    profile = ProfilePipeline()
    save = profile.run([data])

    user = User()
    user_info = user.get_user_from_id(g.user['id'])
    g.user = user_info

    ret_val = {
        "success": save,
        "user": user_info
    }

    return jsonify(ret_val)

@app.route("/login", methods=['POST'])
def login_user():
    data = request.get_json()
    data = data['user']

    user = User()
    pw_hash = user.get_password_hash(data['email'])
    validate = bcrypt.check_password_hash(pw_hash, data['password'])
    user_info = user.get_user_from_email(data['email'])
    token = user.generate_auth_token(user_info['id'])

    ret_val = {
        "success": validate,
        "token": token,
        "user": user_info
    }

    return jsonify(ret_val)

# remote server termination for tests
@app.route("/shutdown", methods=['POST'])
def shutdown():
    shutdown_server()

    ret_val = {
        'message': 'Server shutting down ...'
    }

    return jsonify(ret_val)

if __name__ == "__main__":
    # start application server
    app.run(host="0.0.0.0", port=5000, debug=True)
