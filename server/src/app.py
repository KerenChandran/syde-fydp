"""
    Route definitions and application server instantiation.
"""
import os

from flask import Flask, jsonify, request
from db_utils import connect
from elasticsearch import Elasticsearch

import pdb

# global application instance
app = Flask(__name__, static_url_path='')

# global database connection
crs = connect()

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

    return_msg = {
        "success": success
    }

    return jsonify(return_msg)


if __name__ == "__main__":
    # start application server
    app.run(host="0.0.0.0", port=5000, debug=True)
