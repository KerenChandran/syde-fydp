"""
    Route definitions and application server instantiation.
"""
import os
import io
import csv
import json

from flask import Flask, jsonify, request, g
from flask_bcrypt import Bcrypt
from flask_httpauth import HTTPBasicAuth
from flask_login import LoginManager
import requests as rq

from lib.upload import UploadPipeline
from lib.user import User
from lib.schedule import SchedulePipeline, ScheduleFilter
from lib.accounts import TransactionUtil


# global application instance
app = Flask(__name__, static_url_path='')
# bcrypt for encryption
bcrypt = Bcrypt(app)
# authentication / login stuff
auth = HTTPBasicAuth()
login_manager = LoginManager()
login_manager.init_app(app)

# define upload folder
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# HELPER METHODS
def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


# function for authentication
# TODO: Need to verify that token is passed through properly here
@auth.verify_password
def verify_password(username_or_token, password = None):
    user = User()
    # try verifying by token first
    user_info = user.verify_token(username_or_token)
    if not user_info:
        if not password:
            return False
        # now verify by token
        pw_hash = user.get_password_hash(username_or_token)
        verify = bcrypt.check_password_hash(pw_hash, password)
        if verify is True:
            g.user = user
        return verify
    else:
        return True


# root URL
@app.route("/")
def root():
    return jsonify({"message": "Flask application base."})


# single resource upload
@app.route("/resource_upload", methods=['POST'])
def upload_resource():
    # get request parameters
    data = request.get_json()
    data = data['resource']

    user_id = g.user['id']

    # update data point with ownerId
    data['ownerId'] = user_id

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

    # get single owner id for all resources
    user_id = g.user['id']

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
        
        # add owner data to each record
        body[idx]['ownerId'] = user_id

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
    data = request.form
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
    data = request.form
    # needs token
    # TODO: check with KC if this is how to get token from client
    try:
        token = data['token']
        user = User()
        user_info = user.verify_token(token)
    except:
        user_info = None

    ret_val = {
        "user": user_info
    }
    return jsonify(ret_val)


@app.route("/login", methods=['POST'])
def login_user():
    data = request.form

    user = User()
    pw_hash = user.get_password_hash(data['email'])
    validate = bcrypt.check_password_hash(pw_hash, data['password'])
    user_info = user.get_user_from_email(data['email'])
    token = user.generate_auth_token(user_info[0]['id'])

    ret_val = {
        "success": validate,
        "token": token,
        "user": user_info
    }

    return jsonify(ret_val)


# scheduling endpoints
@app.route("/submit_initial_availability", methods=['POST'])
def submit_initial_availability():
    data = request.get_json()

    user_id = g.user['id']

    pipeline = SchedulePipeline(user_id=user_id)

    success, errors = pipeline.run([data], block_scheduling=False)

    ret_val = {
        "success": success,
        "errors": errors
    }

    return jsonify(ret_val)


@app.route("/submit_schedule_blocks", methods=['POST'])
def submit_schedule_blocks():
    data = request.get_json()

    user_id = g.user['id']

    pipeline = SchedulePipeline(user_id=user_id)

    success, errors = pipeline.run([data], init_availability=False)

    ret_val = {
        "success": success,
        "errors": errors
    }

    return jsonify(ret_val)

@app.route("/submit_schedule_filter", methods=['POST'])
def submit_schedule_filter():
    data = request.get_json()

    window_start = data['window_start']

    window_end = data['window_end']

    initial_window = (window_start, window_end)

    preferred_duration = data['preferred_duration']

    filter_engine = ScheduleFilter()

    success, resource_list, errors = \
        filter_engine.filter(initial_window, preferred_duration)

    ret_val = {
        "success": success,
        "errors": errors,
        "resources": resource_list
    }

    return jsonify(ret_val)


# transaction endpoints
@app.route("/create_basic_profile", methods=['POST'])
def create_basic_profile():
    """
        Non-primary method used to create a basic trxn profile for a given user.
    """
    user_id = g.user['id']

    trxn = TransactionUtil(user_id)

    success = trxn.create_basic_profile()

    ret_val = {
        'success': success
    }

    return jsonify(ret_val)


@app.route("/get_accounts", methods=['GET'])
def get_trxn_accounts():
    user_id = g.user['id']

    trxn = TransactionUtil(user_id)

    account_information = trxn.get_account_information()

    ret_val = {
        'account_information': account_information
    }

    return jsonify(ret_val)


@app.route("/specify_account_use", methods=['POST'])
def specify_account_types():
    data = request.get_json()

    account_id = data['account_id']

    account_use = data['account_use']

    trxn = TransactionUtil(user_id)

    success, errors = trxn.specify_account_usage(account_id, account_use)

    ret_val = {
        'success': success,
        'errors': errors
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
