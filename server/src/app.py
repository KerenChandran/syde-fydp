"""
    Route definitions and application server instantiation.
"""
import os
import io
import csv
import json

from flask import Flask, jsonify, request, g, send_from_directory
from flask_bcrypt import Bcrypt
from flask_httpauth import HTTPTokenAuth
from flask_login import LoginManager
import requests as rq

from lib.upload import UploadPipeline
from lib.user import User
from lib.profile import ProfilePipeline
from lib.schedule import SchedulePipeline, ScheduleFilter
from lib.accounts import TransactionUtil
from lib.resource import ResourceUtil
from lib.request import RequestUtil
from lib.file import FileUtil

import pdb

# global application instance
app = Flask(__name__, static_url_path='')
# bcrypt for encryption
bcrypt = Bcrypt(app)

# authentication / login stuff
auth = HTTPTokenAuth('Bearer')
login_manager = LoginManager()
login_manager.init_app(app)

# define upload folders - image and file
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
IMAGE_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static_image')
FILE_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static_file')
app.config['IMAGE_UPLOAD_FOLDER'] = IMAGE_UPLOAD_FOLDER
app.config['FILE_UPLOAD_FOLDER'] = FILE_UPLOAD_FOLDER


# HELPER METHODS
def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


# function for authentication
# TODO: Need to verify that token is passed through properly here
@auth.verify_token
def verify_token(token):
    user = User()
    user_info = user.verify_token(token)
    if user_info:
        setattr(g, 'user', user_info)
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


"""
    UPLOAD ENDPOINTS
"""
@app.route("/upload_resource", methods=['POST'])
@auth.login_required
def upload_resource():
    # get request parameters
    data = request.get_json()
    data = data['resource']

    user_id = g.user['id']

    # update data point with ownerid
    data['ownerid'] = user_id

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


@app.route("/upload_resource_bulk", methods=['POST'])
@auth.login_required
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

    # assumption: ownerid data point is present for each record

    for idx, dp in enumerate(body):
        # add location data to each record
        body[idx]['location'] = location
        
        # add owner data to each record
        body[idx]['ownerid'] = user_id

    # run upload pipeline
    pipeline = UploadPipeline()

    success, errors, df = pipeline.run(body)

    # TODO: handle resource_ids returned by run method

    ret_val = {
        'resources': body
    }

    return jsonify(ret_val)


"""
    RESOURCE DATA RETRIEVAL ENDPOINTS
"""
@app.route("/get_resources", methods=['POST'])
def get_resources():
    # retrieve resource list
    data = request.get_json()

    res_list = data['resource_list'] if 'resource_list' in data else []

    res_list = [int(rid) for rid in res_list]

    resutil = ResourceUtil()

    success, errors, resource_data = resutil.get_resource_data(res_list)

    ret_val = {
        'success': success,
        'errors': errors,
        'resource_data': resource_data
    }

    return jsonify(ret_val)


@app.route("/get_resource_schedules", methods=['POST'])
def get_resource_schedules():
    # retrieve resource list
    data = request.get_json()

    res_list = data['resource_list'] if 'resource_list' in data else []

    res_list = [int(rid) for rid in res_list]

    resutil = ResourceUtil()

    success, errors, resource_data = \
        resutil.get_resource_data(res_list, dataset="schedule")

    ret_val = {
        'success': success,
        'errors': errors,
        'resource_data': resource_data
    }

    return jsonify(ret_val)


@app.route("/get_resource_files/<int:resource_id>")
def get_resource_files(resource_id):
    # retrieve resource_id

    file_util = FileUtil(image_dir=app.config['IMAGE_UPLOAD_FOLDER'],
                         file_dir=app.config['FILE_UPLOAD_FOLDER'])

    fldata = file_util.get_uploaded_files(resource_id, 'resource')

    ret_val = {
        'file_data': fldata
    }

    return jsonify(ret_val)

@app.route("/get_user_images/<int:user_id>")
def get_user_images(user_id):
    # retrieve user_id
    file_util = FileUtil(image_dir=app.config['IMAGE_UPLOAD_FOLDER'],
                         file_dir=app.config['FILE_UPLOAD_FOLDER'])

    fldata = file_util.get_uploaded_files(user_id, 'user')

    ret_val = {
        'file_data': fldata
    }

    return jsonify(ret_val)


@app.route("/create_skeleton_resource", methods=['GET'])
def create_skeleton_resource():
    # create resource object and retrieve id
    res_util = ResourceUtil()

    success, errors, resource_id = res_util.create_skeleton_resource()

    ret_val = {
        'success': success,
        'errors': errors,
        'resource_id': resource_id
    }

    return jsonify(ret_val)


"""
    FILE UPLOAD/DOWNLOAD ENDPOINTS
"""
@app.route("/resource_image_upload", methods=['POST'])
@auth.login_required
def resource_image_upload():
    # retrieve resource id
    data = request.form

    resource_id = data['resource_id']

    # retrieve image to be uploaded - can be either for resource or accessory
    image_file = request.files['image']
    
    image_type = data['image_type']

    file_util = FileUtil(image_dir=app.config['IMAGE_UPLOAD_FOLDER'])

    success, errors = \
        file_util.upload_file('resource', image_file, resource_id=resource_id,
                              file_type='image_file', image_type=image_type)

    ret_val = {
        'success': success,
        'errors': errors
    }

    return jsonify(ret_val)


@app.route("/resource_file_upload", methods=['POST'])
@auth.login_required
def resource_file_upload():
    # retrieve resource id
    data = request.form

    resource_id = data['resource_id']

    # retrieve file to be uploaded
    file = request.files['resource_file']

    # retrieve metadata
    file_type = data['file_type']

    file_util = FileUtil(file_dir=app.config['FILE_UPLOAD_FOLDER'])

    success, errors = \
        file_util.upload_file('resource', file, resource_id=resource_id,
                              file_type='misc_file', misc_type=file_type)

    ret_val = {
        'success': success,
        'errors': errors
    }

    return jsonify(ret_val)


@app.route("/user_image_upload", methods=['POST'])
@auth.login_required
def user_image_upload():
    # retrieve user id
    data = request.form

    user_id = data['user_id']

    # retrieve image to be uploaded
    image_file = request.files['image']

    file_util = FileUtil(image_dir=app.config['IMAGE_UPLOAD_FOLDER'])

    success, errors = file_util.upload_file('user', image_file, user_id=user_id)

    ret_val = {
        'success': success,
        'errors': errors
    }

    return jsonify(ret_val)


@app.route("/download_file/<file_type>/<filename>")
def download(filename, file_type):
    ft_map = {
        "image": app.config['IMAGE_UPLOAD_FOLDER'],
        "file": app.config['FILE_UPLOAD_FOLDER']
    }

    return send_from_directory(directory=ft_map[file_type], filename=filename)


"""
    PROFILE ENDPOINTS
"""
@app.route("/new_user", methods=['POST'])
def new_user():

    data = request.get_json()
    data = data['user']
    email = data['email']
    password_hash = bcrypt.generate_password_hash(data['password'])

    # save user in database
    save_user = User()
    user_id = save_user.save(email, password_hash)

    trxn = TransactionUtil(user_id)
    trxn_success = trxn.create_basic_profile()
    trxn_accounts = trxn.get_account_information()

    # login user
    if user_id is None:
        auth_token = None
        user = None
        success = False
    # return token
    else:
        auth_token = save_user.generate_auth_token(user_id)
        user = save_user.get_user_from_id(user_id)
        success = True

    ret_val = {
        "success": success,
        "trxn_succes": trxn_success,
        "token": auth_token,
        "user": user,
        "accounts": trxn_accounts
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

@app.route("/auth_user", methods=['POST'])
@auth.login_required
def auth_user():

    user_id = g.user['id']

    user = User()
    user_info = user.get_user_from_id(user_id)

    trxn = TransactionUtil(user_id)
    trxn_accounts = trxn.get_account_information()

    ret_val = {
        "user": user_info,
        "accounts": trxn_accounts
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

@app.route("/fetch_all_users", methods=['GET'])
def fetch_all_users():
    user = User()
    all_users = user.get_all_users()

    ret_val = {
        "all_users": all_users
    }
    return jsonify(ret_val)

@app.route("/fetch_user_by_id", methods=['POST'])
def fetch_user():
    data = request.get_json()
    user = User()
    user_info = user.get_user_from_id(data['user_id'])
    ret_val = {
        "user": user_info
    }
    return jsonify(ret_val)

"""
    SCHEDULING ENDPOINTS
"""
@app.route("/submit_initial_availability", methods=['POST'])
@auth.login_required
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
@auth.login_required
def submit_schedule_blocks():
    # list of block data points
    data = request.get_json()

    user_id = g.user['id']

    pipeline = SchedulePipeline(user_id=user_id)

    success, errors = pipeline.run(data, init_availability=False, 
                                   block_availability=False)

    ret_val = {
        "success": success,
        "errors": errors
    }

    return jsonify(ret_val)


@app.route("/submit_availability_blocks", methods=['POST'])
@auth.login_required
def submit_availability_blocks():
    # list of block data points
    data = request.get_json()

    user_id = g.user['id']

    pipeline = SchedulePipeline(user_id=user_id)

    success, errors = pipeline.run(data, init_availability=False, 
                                   block_scheduling=False)

    ret_val = {
        'success': success,
        'errors': errors
    }

    return jsonify(ret_val)


@app.route("/submit_intermediate_availability_blocks", methods=['POST'])
@auth.login_required
def submit_intermediate_availability_blocks():
    # list of block data points
    data = request.get_json()

    existing_blocks = data['existing_blocks']

    new_block_start = data['new_block_start']

    new_block_end = data['new_block_end']

    new_block_recurring = data['new_block_recurring']

    new_block_payload = {
        'block_start': new_block_start,
        'block_end': new_block_end,
        'block_recurring': new_block_recurring
    }

    user_id = g.user['id']

    pipeline = SchedulePipeline(user_id=user_id)

    success, errors, new_blocks = pipeline.intermediate_availability_run(
        existing_blocks, new_block_payload)

    ret_val = {
        'success': success,
        'errors': errors,
        'new_blocks': new_blocks
    }

    return jsonify(ret_val)


@app.route("/submit_schedule_filter", methods=['POST'])
def submit_schedule_filter():
    data = request.get_json()

    window_start = data['window_start']

    window_end = data['window_end']

    initial_window = (window_start, window_end)

    preferred_duration = data['preferred_duration']

    pd_payload = {}

    pd_payload['type'] = str(preferred_duration['type'])

    pd_payload['quantity'] = int(preferred_duration['quantity'])

    filter_engine = ScheduleFilter()

    success, resource_list, errors = \
        filter_engine.filter(initial_window, pd_payload)

    filter_dict = dict(resource_list)

    # retrieve resource information
    secondary_res_list = [int(rid) for rid, _ in resource_list]

    resutil = ResourceUtil()

    success, errors, resource_data = \
        resutil.get_resource_data(secondary_res_list)

    for data in resource_data:
        data['first_available'] = filter_dict[data['resource_id']]

    ret_val = {
        "success": success,
        "errors": errors,
        "resources": resource_data
    }

    return jsonify(ret_val)


"""
    TRANSACTION ENDPOINTS
"""
@app.route("/create_basic_profile", methods=['POST'])
@auth.login_required
def create_basic_profile():
    """
        Non-primary method used to create a basic trxn profile for a given user.
    """
    user_id = g.user['id']

    trxn = TransactionUtil(user_id=user_id)

    success = trxn.create_basic_profile()

    ret_val = {
        'success': success
    }

    return jsonify(ret_val)


@app.route("/get_accounts", methods=['GET'])
@auth.login_required
def get_trxn_accounts():
    user_id = g.user['id']

    trxn = TransactionUtil(user_id=user_id)

    account_information = trxn.get_account_information()

    ret_val = {
        'account_information': account_information
    }

    return jsonify(ret_val)


@app.route("/specify_account_use", methods=['POST'])
@auth.login_required
def specify_account_types():
    user_id = g.user['id']
    data = request.get_json()

    account_id = data['account_id']

    account_use = data['account_use']

    trxn = TransactionUtil()

    success, errors = trxn.specify_account_usage(account_id, account_use)

    ret_val = {
        'success': success,
        'errors': errors
    }

    return jsonify(ret_val)


"""
    REQUEST ENDPOINTS
"""
@app.route("/get_requests", methods=['POST'])
def get_requests():
    data = request.get_json()

    owner_id = int(data['owner_id'])

    request_util = RequestUtil()

    owned_request_data, submitted_request_data = \
        request_util.get_requests(owner_id)

    ret_val = {
        "owned_requests": owned_request_data,
        "submitted_requests": submitted_request_data
    }

    return jsonify(ret_val)


@app.route("/validate_request_block", methods=['POST'])
@auth.login_required
def validate_request_block():
    user_id = g.user['id']
    data = request.get_json()

    resid = int(data['resource_id'])
    start = str(data['block_start'])
    end = str(data['block_end'])
    recur = dict(data['block_recurring'])

    schedpipe = SchedulePipeline()

    # generate blocks based on recurrence
    schedpipe.generate_blocks(resid, start, end, block_recurring=recur)

    generated_blocks = schedpipe.get_generated_blocks()

    # iterate through each block and check if an overlap is present
    final_blocks = []

    for block in generated_blocks:
        reg_overlap = schedpipe.check_block_overlap(
            block['resource_id'], block['block_start'], block['block_end'])

        avail_overlap = schedpipe.check_block_overlap(
            block['resource_id'], block['block_start'], block['block_end'],
            availability=True)

        if reg_overlap and avail_overlap:
            block['user_id'] = user_id

            final_blocks.append(block)

    ret_val = {
        'final_blocks': final_blocks,
        'errors': schedpipe.get_error_logs()
    }

    return jsonify(ret_val)


@app.route("/submit_request", methods=['POST'])
@auth.login_required
def submit_request():
    data = request.get_json()

    # requests are submitted on an individual basis
    # recreate the data object for sanity checks
    request_object = {}

    # required attributes
    request_object['resource_id'] = int(data['resource_id'])

    request_object['user_id'] = int(data['user_id'])

    requested_blocks = data['requested_blocks']

    # sanity - this check can be handled on client
    assert(len(requested_blocks) > 0)

    request_object['requested_blocks'] = list(requested_blocks)

    incentive_data = data['incentive_data']

    # sanity - this check can be handled on client
    # new incentive present and incentive id passed
    check_1 = bool(incentive_data['new_incentive']) and \
        ('incentive_id' in incentive_data and 
         incentive_data['incentive_id'] is not None)

    assert(not check_1)

    # new incentive missing and no incentive id
    check_2 = not bool(incentive_data['new_incentive']) and \
        ('incentive_id' not in incentive_data or 
         incentive_data['incentive_id'] is None)

    assert(not check_2)

    request_object['incentive_data'] = dict(incentive_data)

    # optional attributes
    request_object['source_account'] = \
        int(data['source_account']) if 'source_account' in data else None

    request_object['message'] = \
        str(data['message']) if 'message' in data else ""

    request_util = RequestUtil()

    success, errors, request_data = \
        request_util.submit_request([request_object])

    ret_val = {
        'success': success,
        'errors': errors,
        'request_data': request_data 
    }

    return jsonify(ret_val)


@app.route("/accept_request", methods=['POST'])
@auth.login_required
def accept_request():
    data = request.get_json()

    # create util payload for correctness
    payload = {}

    # required attributes
    payload['request_id'] = int(data['request_id'])

    # optional attributes
    payload['target_account'] = \
        int(data['target_account']) if 'target_account' in data else None

    payload['message'] = str(data['message']) if 'message' in data else ""

    request_util = RequestUtil()

    success, errors = request_util.accept_reject_request("accept", payload)

    ret_val = {
        "success": success,
        "errors": errors
    }

    return jsonify(ret_val)


@app.route("/reject_request", methods=['POST'])
@auth.login_required
def reject_request():
    data = request.get_json()

    # create util payload
    payload = {}

    # required attributes
    payload['request_id'] = int(data['request_id'])

    # optional attributes
    payload['message'] = str(data['message']) if 'message' in data else ""

    request_util = RequestUtil()

    success, errors = request_util.accept_reject_request("reject", payload)

    ret_val = {
        "success": success,
        "errors": errors
    }

    return jsonify(ret_val)


@app.route("/get_transfer_amount", methods=['POST'])
@auth.login_required
def get_transfer_amount():
    data = request.get_json()

    fee_amount = float(data['fee_amount'])

    fee_cadence = str(data['fee_cadence'])

    block_list = list(data['block_list'])

    # use helper method in request utility class to compute total amount
    request_util = RequestUtil()

    transfer_amount = request_util.compute_transfer_amount(
        fee_amount, fee_cadence, block_list)

    ret_val = {
        "transfer_amount": transfer_amount
    }

    return jsonify(ret_val)


"""
    MISC
"""
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
