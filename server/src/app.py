"""
    Route definitions and application server instantiation.
"""

from flask import Flask
from db_utils import connect
from elasticsearch import Elasticsearch

# global application instance
app = Flask(__name__)

# global database connection
crs = connect()

# global elasticsearch connection
es = Elasticsearch([
    {'host':'es', 'port':9200}
])

@app.route("/")
def root():
    return "Flask application base."


if __name__ == "__main__":
    # start application server
    app.run(host="0.0.0.0", port=5000, debug=True)
