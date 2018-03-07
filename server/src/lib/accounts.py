"""
    Module with account / trxn - related methods and classes.
"""
import json

import requests as rq
import json

from utils.db import Cursor


class TransactionUtil:
    def __init__(self, user_id=None):
        """
            Parameters
            ----------
            user_id : {int}
                unique user identifier
        """
        self.uid = int(user_id) if user_id is not None else user_id
        
        self.base_url = "http://trxn_server:5000/%s"
        
        self.json_headers = {
            'Content-Type': 'application/json'
        }

        self.crs = Cursor()

        self.error_logs = []

    def create_basic_profile(self):
        """
            Method to create a basic profile on the transaction system for
            a given user.
        """

        payload = {'user_id': self.uid}

        success = rq.post(self.base_url % "create_basic_profile", 
                          data=json.dumps(payload), headers=self.json_headers)

        success = json.loads(success.text)

        return success['success']

    def get_account_information(self):
        """
            Method to retrieve account information for a given user.
        """
        payload = {'user_id': self.uid}

        account_information = \
            rq.post(self.base_url % "get_accounts", data=json.dumps(payload),
                    headers=self.json_headers)

        account_information = json.loads(account_information.text)

        return account_information['accounts']

    def transfer_funds(self, source_account, target_account, transfer_amount):
        """
            Method to transfer funds from one account to another.

            Parameters
            ----------
            source_account : {int}
                source account identifier

            target_account : {int}
                target account identifier

            transfer_amount : {float}
                amount of money to transfer from source account to target
        """
        payload = {
            'source_account': int(source_account),
            'target_account': int(target_account),
            'fund_amount': float(transfer_amount)
        }

        res = \
            rq.post(self.base_url % "transfer_funds", data=json.dumps(payload),
                    headers=self.json_headers)

        res = json.loads(res.text)

        success = res['success']

        errors = res['errors']

        return success, errors

    def specify_account_usage(self, account_id, account_use):
        """
            Method to sepcify account information on ShareIt platform (i.e.
            whether account for that particular user is going to be used
            for inflow or outflow).

            Parameters
            ----------
            account_id : {string}
                unique account identifier

            account_use : {string}
                specification as to whether the account is going to be used
                for inflow or outflow. Valid options: inflow, outflow
        """
        if account_use != 'inflow' or account_use != 'outflow':
            self.error_logs.append("Invalid account usage spec.")
            return (False, self.error_logs)

        account_id = str(account_id)

        # retrieve account information for this particular user
        account_information = self.get_account_information()

        # validate that the passed account matches the usage spec
        account_found = False
        correct_spec = True

        usage_map = {
            'inflow': ['operational'],
            'outflow': ['research', 'operational']
        }

        for data in account_information:
            if data['id'] != account_id:
                continue

            account_found = True

            if data['type'] not in usage_map[account_use]:
                correct_spec = False
                break

        if not account_found:
            # account was not found for this particular user
            self.error_logs.append("Invalid account specified for this user.")
            return (False, self.error_logs)
        
        elif not correct_spec:
            # incorrect usage for this particular account
            self.error_logs.append(
                "Incorrect usage specified for this particular account.")
            return (False, self.error_logs)

        account_spec_query = \
        """
            INSERT INTO user_account (user_id, account_id, account_use)
            VALUES ({uid}, '{acc_id}', '{acc_use}')
        """.format(uid=self.uid, acc_id=str(account_id), 
                   account_use=str(account_use))

        self.crs.execute(account_spec_query)

        return (True, self.error_logs)


if __name__ == '__main__':
    trxn = TransactionUtil(1000)
