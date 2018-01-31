"""
    Accounting system simulation.
"""
import json

import requests as rq


url = "http://localhost:5000/%s"

json_headers = {
    'Content-Type': 'application/json'
}

def pprint_dict(data):
    """
        Helper function to pretty print dictionary items.

        Parameters
        ----------
        data : {dict}
            Target dictionary to print
    """
    for key, val in data.iteritems():
        print "%s: %s" % (key, val)
        print "\n"

    return


def main():
    # create users and trigger basic profile creation
    user_1 = {'user_id': 1}
    user_2 = {'user_id': 2}

    create_profile = \
        rq.post(url % "create_basic_profile", data=json.dumps(user_1), 
                headers=json_headers)

    pprint_dict(json.loads(create_profile.text))

    create_profile = \
        rq.post(url % "create_basic_profile", data=json.dumps(user_2), 
                headers=json_headers)

    pprint_dict(json.loads(create_profile.text))

    # get account data for each of the users
    account_data = \
        rq.post(url % "get_accounts", data=json.dumps(user_1), 
                headers=json_headers)

    pprint_dict(json.loads(account_data.text))

    account_data = \
        rq.post(url % "get_accounts", data=json.dumps(user_2), 
                headers=json_headers)

    pprint_dict(json.loads(account_data.text))

    source_account = raw_input("Please specify source account id:")

    target_account = raw_input("Please specify target account id:")

    transfer_amount = raw_input("Please specify amount to transfer:")

    payload = {
        'source_account': source_account,
        'target_account': target_account,
        'fund_amount': transfer_amount
    }

    fund_transfer = \
        rq.post(url % "transfer_funds", data=json.dumps(payload), 
                headers=json_headers)

    pprint_dict(json.loads(fund_transfer.text))

    return True


if __name__ == '__main__':
    main()
