"""
    Route definitions and application server instantiation.
"""
import json

from flask import Flask, jsonify, request

import trxn

# global application instance
app = Flask(__name__, static_url_path='')

# HELPER METHODS
def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


# root URL
@app.route("/")
def root():
    return jsonify({"message": "Transaction server."})


# basic profile creation
@app.route("/create_basic_profile", methods=['POST'])
def create_basic_profile():
    data = request.get_json()
    user_id = data['user_id']

    # create research and operational accounts
    research_acct = trxn.create_account(user_id, 'research')
    op_acct = trxn.create_account(user_id, 'operational')

    success = research_acct and op_acct

    ret_val = {
        'success': success
    }

    return jsonify(ret_val)
 

@app.route("/get_accounts", methods=['POST'])
def get_accounts():
    data = request.get_json()
    user_id = data['user_id']

    accounts = trxn.retrieve_accounts(user_id)

    ret_val = {
        'accounts': accounts
    }

    return jsonify(ret_val)

@app.route("/transfer_funds", methods=['POST'])
def transfer_funds():
    data = request.get_json()
    source_acct = int(data['source_account'])
    target_acct = int(data['target_account'])
    fund_amount = float(data['fund_amount'])

    success, errors = \
        trxn.transfer_funds(source_acct, target_acct, fund_amount)

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
