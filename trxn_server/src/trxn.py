"""
    Transactions module for handling account creation and fund transfer.
"""
import random
from decimal import Decimal

from utils.db import Cursor


# global database connection object
crs = Cursor()

def valid_user(user_id):
    """
        Helper function which validates passed user id (i.e. does user exist
        on trxn platform).

        Parameters
        ----------
        user_id : {str}
            unique user identifier
    """
    user_check_query = """
        SELECT id
        FROM trxn_user
        WHERE id = '{uid}'
    """.format(uid=user_id)

    return crs.check_record_present(user_check_query)


def valid_account(account_id):
    """
        Helper function which validates passed account id (i.e. does account
        exist on trxn platform).

        Parameters
        ----------
        account_id : {str}
            unique account identifier
    """
    acct_check_query = """
        SELECT id
        FROM account
        WHERE id = {acct_id}
    """.format(acct_id=account_id)

    return crs.check_record_present(acct_check_query)


def get_balance(account_id):
    """
        Helper function which retrieves the balance of a specified account.

        Parameters
        ----------
        account_id : {str}
            unique account identifier
    """
    retrieve_balance_query = """
        SELECT balance
        FROM account
        WHERE id = {acc_id}
    """.format(acc_id=account_id)

    return float(crs.fetch_first(retrieve_balance_query))


def get_type(account_id):
    """
        Helper function which retrieves the type of a specified account.

        Parameters
        ----------
        account_id : {str}
            unique account identifier
    """
    retrieve_type_query = """
        SELECT type
        FROM account
        WHERE id = {acc_id}
    """.format(acc_id=account_id)

    return str(crs.fetch_first(retrieve_type_query))


def sufficient_funds(account_id, fund_amount):
    """
        Helper function which checks whether the specified account has a
        balance gte the passed fund amount.

        Parameters
        ----------
        account_id : {str}
            unique account identifier

        fund_amount : {float}
            amount to compare account balance against
    """
    return get_balance(account_id) >= fund_amount


def create_account(user_id, account_type):
    """
        Main method to create an account for a particular user.

        Parameters
        ----------
        user_id : {str}
            identifier of user for which account is being created

        account_type : {str}
            corresponds to either 'research' or 'operational'
    """
    # check to see that user exists
    if not valid_user(user_id):
        # create user record in user table
        crs.execute("""
            INSERT INTO trxn_user (id)
            VALUES ('{uid}')
        """.format(uid=user_id))

    # generate random initial amount for account
    init_amt = random.randint(10000, 20000)

    # create account
    create_account_query = """
        INSERT INTO account (type, balance)
        VALUES ('{acc_type}', {balance})
        RETURNING id
    """.format(acc_type=account_type, balance=init_amt)

    acct_id = crs.fetch_first(create_account_query)

    # map user to account
    user_account_query = """
        INSERT INTO user_account (user_id, account_id)
        VALUES ('{uid}', {acc_id})
    """.format(uid=user_id, acc_id=acct_id)

    crs.execute(user_account_query)

    crs.commit()

    return True


def retrieve_accounts(user_id):
    """
        Main method to retrieve accounts for a particular user.

        Parameters
        ----------
        user_id : {str}
            identifier of user for which accounts are being retrieved
    """
    if not valid_user(user_id):
        return []

    retrieve_acct_query = """
        SELECT account.id, account.type, account.balance
        FROM user_account
        INNER JOIN account
            ON user_account.account_id = account.id
            AND user_account.user_id = '{uid}'
    """
    acct_info = crs.fetch_dict(retrieve_acct_query.format(uid=user_id))

    # make account information JSON compatible before sending
    data = []

    for acct in acct_info:
        placeholder = {}

        for key, val in acct.iteritems():
            if isinstance(val, Decimal):
                val = float(val)

            placeholder[key] = val

        data.append(placeholder)

    return data


def transfer_funds(source, target, amount):
    """
        Main method to transfer funds from source to target account.

        Parameters
        ----------
        source : {str}
            identifier of source account

        target : {str}
            identifier of target account

        amount : {float}
            amount of money to be transferred from source to target account
    """
    if not valid_account(source) or not valid_account(target):
        return False, "invalid account information"
    elif not sufficient_funds(source, amount):
        return False, "insufficient funds in %s" % source
    elif get_type(target) == 'research':
        return False, "funds cannot be transferred into a research account"

    source_balance = get_balance(source) - amount

    target_balance = get_balance(target) + amount

    update_query = """
        UPDATE account
        SET balance={balance}
        WHERE id = {acct}
    """

    # update source balance
    crs.execute(update_query.format(balance=source_balance, acct=source))

    # update target balance
    crs.execute(update_query.format(balance=target_balance, acct=target))

    crs.commit()

    return True, ""


if __name__ == '__main__':
    print "Use as module."
