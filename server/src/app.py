"""
    Route definitions and application server instantiation.
"""

from flask import Flask
from db_utils import connect

# global application instance
app = Flask(__name__)

# global database connection
crs = connect()

@app.route("/")
def root():
    return "Flask application base."


if __name__ == "__main__":
    # start application server
    app.run(host="0.0.0.0", port=5000, debug=True)
