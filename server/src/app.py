"""
    Route definitions and application server instantiation.
"""
import os
import io
import csv
import json

from flask import Flask, jsonify, request

from pipelines.upload import UploadPipeline


# global application instance
app = Flask(__name__, static_url_path='')

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
