"""
    Module with class specific to resource requesting.
"""
from __future__ import division

import datetime as dt

from pipeline import Pipeline
from notification import NotificationUtil
from accounts import TransactionUtil
from schedule import SchedulePipeline


class RequestUtil(Pipeline):
    def __init__(self):
        super(RequestUtil, self).__init__("request.json")

        self.notif_util = NotificationUtil()

        self.trxn_util = TransactionUtil()

        self.cadence_divisibility_map = {
            'hourly': 60**2,
            'daily': 60**2 * 24,
            'weekly': 60**2 * 24 * 7
        }

    def validate_request(self, request_id):
        """
            Helper method to check to see whether a passed request exists.

            Parameters
            ----------
            request_id : {int}
                unique identifier of request
        """
        if not isinstance(request_id, int):
            self.error_logs.append("Invalid datatype for request identifier.")
            return False

        validate_request_query = \
        """
            SELECT id
            FROM request
            WHERE id = {rid}
        """.format(rid=request_id)

        return self.crs.check_record_present(validate_request_query)

    def get_requester_id(self, request_id):
        """
            Helper method to retrieve requester identifer for a particular
            request.

            Parameters
            ----------
            request_id : {int}
                unique identifer of request
        """
        get_requester_query = \
        """
            SELECT user_id
            FROM request
            WHERE id = {rid}
        """.format(rid=request_id)

        requester_id = self.crs.fetch_first(get_requester_query)

        return requester_id

    def block_transform(self, block_list):
        """
            Transformation method for request blocks.

            Parameters
            ----------
            block_list : {list}
                list of block objects for which the resource is being requested.
        """
        if not isinstance(block_list, list):
            self.error_logs.append("Invalid data type for passed block.")
            return []
        elif len(block_list) == 0:
            self.error_logs.append("Empty block list passed.")
            return []

        expected_dt_format = '%Y-%m-%d %H:%M'

        block_store = []

        for elem in block_list:
            block_start = elem['block_start']
            block_end = elem['block_end']

            block_obj = {}

            # convert and re-convert start block
            try:
                block_start = \
                    dt.datetime.strptime(block_start, expected_dt_format)
                block_start = block_start.strftime(expected_dt_format)

                block_obj['block_start'] = block_start
            except:
                continue

            # convert and re-convert end block
            try:
                block_end = \
                    dt.datetime.strptime(block_end, expected_dt_format)
                block_end = block_end.strftime(expected_dt_format)

                block_obj['block_end'] = block_end
            except:
                continue

            if 'block_start' in block_obj and 'block_end' in block_obj:
                block_store.append(block_obj)

        return block_store

    def basic_attribute_load(self, record):
        """
            Underlying method to load basic attributes for request.

            Parameters
            ----------
            record : {pandas.Series}
                Dataframe row corresponding to a single request for submission.
        """
        flds, record_data = self.crs.sanitize(record)

        request_fields = self.database_fields['request']

        request_fields = list(set(flds) & set(request_fields))

        data_dict = dict(zip(flds, record_data))

        data_dict = {fld: data_dict[fld] for fld in request_fields}

        # add owner_accepted flag value
        data_dict['owner_accepted'] = 'False'
        data_dict['owner_rejected'] = 'False'

        load_request_query = \
        """
            INSERT INTO request ({req_flds})
            VALUES ({data_vals})
            RETURNING id;
        """.format(req_flds=",".join(data_dict.keys()), 
                   data_vals=",".join(data_dict.values()))

        req_id = self.crs.fetch_first(load_request_query)

        return req_id

    def incentive_load(self, request_id, incentive_data):
        """
            Underlying method to load incentive data for a submitted request.

            Parameters
            ----------
            request_id : {int}
                unique identifier for request

            incentive_data : {dict}
                record with incentive information for a given request.
        """
        if not incentive_data['new_incentive'] and \
            ('incentive_id' not in incentive_data or incentive_data['incentive_id'] is None):
            self.error_logs.append(
                "Neither existing incentive or new incentive specified.")
            return None

        incentive_id = \
            incentive_data['incentive_id'] if 'incentive_id' in incentive_data \
            else None

        if incentive_data['new_incentive']:
            # create a new incentive record
            incentive_load_query = \
            """
                INSERT INTO incentive (type)
                VALUES ('{type}')
                RETURNING id;
            """.format(type=incentive_data['incentive_type'])

            incentive_id = self.crs.fetch_first(incentive_load_query)

            # check if user fee information is required
            if incentive_data['incentive_type'] == 'user_fee' and \
                ('fee_amount' in incentive_data and 'fee_cadence' in incentive_data):
                user_fee_load_query = \
                """
                    INSERT INTO user_fee (fee_amount, cadence)
                    VALUES ({fee_amt}, '{cadence}')
                    RETURNING id;
                """.format(fee_amt=float(incentive_data['fee_amount']),
                           cadence=incentive_data['fee_cadence'])

                fee_id = self.crs.fetch_first(user_fee_load_query)

                # update incentive information
                incentive_update_query = \
                """
                    UPDATE incentive
                    SET fee_id={fee_id}
                    WHERE id={in_id}
                """.format(fee_id=fee_id, in_id=incentive_id)

                self.crs.execute(incentive_update_query)

        # create mapping record between request and incentive
        request_incentive_mapping_query = \
        """
            INSERT INTO request_incentive (request_id, incentive_id)
            VALUES ({request_id}, {incentive_id})
        """.format(request_id=request_id, incentive_id=incentive_id)

        self.crs.execute(request_incentive_mapping_query)

        return incentive_id

    def block_load(self, request_id, block_list):
        """
            Underlying method to load block data for a submitted request.

            Parameters
            ----------
            request_id : {int}
                unique identifier for request

            block_list : {list}
                list of block data points for a given request.
        """
        block_store = []

        for elem in block_list:
            start = elem['block_start']
            end = elem['block_end']

            block_insert_query = \
            """
                INSERT INTO request_schedule_blocks
                    (request_id, block_start, block_end)
                VALUES ({req_id}, '{start}', '{end}')
                RETURNING block_id;
            """.format(req_id=request_id, start=start, end=end)

            bid = self.crs.fetch_first(block_insert_query)

            block_store.append(bid)

        return block_store

    def notification_load(self, resource_id, message):
        """
            Underlying method to load notification information. This method
            makes use of the notification module to create notifications.

            Parameters
            ----------
            resource_id : {int}
                unique identifier of resource for which request was being
                submitted

            message : {str}
                main message to be embedded within the notification
        """
        # retrieve owner information given the resource
        owner_retrieval_query = \
        """
            SELECT user_id
            FROM resource_user
            WHERE resource_id = {rid}
        """.format(rid=resource_id)

        owner_id = self.crs.fetch_first(owner_retrieval_query)

        message_template = \
        """
        A request for resource_id: {rid} has been submitted.

        REQUESTER MESSAGE
        -----------------
        {req_msg}
        """.format(rid=resource_id, req_msg=message)

        message = message_template

        # create a notification and retrieve its identifier
        success, notification_id = \
            self.notif_util.create_notification(owner_id, message)

        if not success:
            self.error_logs.append(
                "Submission notification could not be created.")
            return None

        return notification_id

    def load(self):
        """
            Main method which facilitates each of the underlying loading
            and aggregation components.
        """
        # load basic attributes
        self.df_transform['request_id'] = self.df_transform.apply(
            lambda x: self.basic_attribute_load(x), axis=1)

        # load schedule blocks
        self.df_transform['block_ids'] = \
            self.df_transform.apply(lambda x: 
                self.block_load(x['request_id'], x['requested_blocks']), axis=1)

        # load incentive information
        self.df_transform['incentive_id'] = \
            self.df_transform.apply(lambda x: 
                self.incentive_load(x['request_id'], x['incentive_data']),
                axis=1)

        # create submission notifications
        self.df_transform['notification_id'] = \
            self.df_transform.apply(lambda x:
                self.notification_load(x['resource_id'], x['message']), axis=1)

        self.crs.commit()

        return

    def create_request_packages(self):
        """
            Underlying method to create a set of packages for all requests. The 
            package includes basic attributes and mapping information.
        """
        remove_cols = ['incentive_data', 'requested_blocks', 'message']

        self.df_transform.drop(remove_cols, inplace=True, axis=1)

        self.final_requests = self.df_transform.to_dict(orient='index')

        self.final_requests = self.final_requests.values()

        return

    def compute_transfer_amount(self, amount, cadence, blocks):
        """
            Helper method to compute the total amount to be transferred
            based on the amount, cadence, and specified duration blocks.

            Parameters
            ----------
            amount : {float}
                user fee amount being charged for usage of resource

            cadence : {str}
                fee cadence that corresponds to specified fee amount (i.e.
                how often is that amount being charged)

            blocks : {list}
                list of blocks corresponding to times for which a resource will
                be used
        """
        if not isinstance(amount, float) or not isinstance(cadence, str) or \
            not isinstance(blocks, list):
            self.error_logs.append("Incorrect parameter type specified")
            return None

        elif len(blocks) == 0:
            self.error_logs.append("Empty block list passed as param.")
            return None

        total_duration = 0

        for block in blocks:
            total_duration += \
                (block['block_end'] - block['block_start']).total_seconds()

        total_duration = \
            total_duration / self.cadence_divisibility_map[fee_cadence]

        transfer_amount = total_duration * fee_amount

        return transfer_amount

    def transfer_funds(self, request_id):
        """
            Underlying method which encapsulates all of the logic associated
            with transferring funds based on the submitted and accepted request.

            Parameters
            ----------
            request_id : {int}
                unique identifier for request
        """
        # retrieve source and target account information for request
        account_retrieval_query = \
        """
            SELECT source_account, target_account
            FROM request
            WHERE id = {rid}
        """.format(rid=request_id)

        result = self.crs.fetch_dict(account_retrieval_query)[0]

        source_account = result['source_account']

        target_account = result['target_account']

        # retrieve fee amount and cadence
        cadence_retrieval_query = \
        """
            SELECT uf.fee_amount, uf.cadence
            FROM request_incentive ri
            INNER JOIN incentive
                ON ri.incentive_id = incentive.id
                AND ri.request_id = {rid}
            INNER JOIN user_fee uf
                ON incentive.fee_id = uf.id
        """.format(rid=request_id)

        result = self.crs.fetch_dict(cadence_retrieval_query)[0]

        fee_amount = float(result['fee_amount'])

        fee_cadence = str(result['cadence'])

        # retrieve all blocks associated with said request
        block_retrieval_query = \
        """
            SELECT block_id, block_start, block_end
            FROM request_schedule_blocks
            WHERE request_id = {rid}
        """.format(rid=request_id)

        blocks = self.crs.fetch_dict(block_retrieval_query)

        # compute total duration - rules:
        # 1) use incentive cadence to determine how to obtain the final 
        #    representation of the computed duration. said representation is 
        #    a multiplicative factor applied to the fee_amount.
        # 2) if numeric representation is a non-integer value, the amount uses
        #    total duration as a multiplicative factor (i.e. final_payment = 
        #    total_duration * fee_amount)
        # 3) use the 'seconds' representation of the timedelta and
        #    divisibility factors based on the cadence.

        transfer_amount = \
            self.compute_transfer_amount(fee_amount, fee_cadence, blocks)

        if not transfer_amount:
            return False

        # transfer funds from source account to target
        success, errors = self.trxn_util.transfer_funds(
            source_account, target_account, transfer_amount)

        if success:
            msg = "$%s transferred from account with number %s." % \
                (str(transfer_amount), str(source_account))
        else:
            msg = "Error in transferring funds from account with number %s." % \
                str(source_account)

        self.error_logs += errors

        # get requester information for passed resource
        receiver_info_retrieval_query = \
        """
            SELECT user_id
            FROM request
            WHERE id = {rid}
        """.format(rid=request_id)

        receiver_id = self.crs.fetch_first(receiver_info_retrieval_query)

        _, notification_id = \
            self.notif_util.create_notification(receiver_id, msg)

        return success

    def accept_request(self):
        """
            Underlying method to undergo request acceptance process.
        """
        record = self.df_transform.iloc[0]

        request_id = int(record['request_id'])

        # update request record with acceptance flag
        update_acceptance_query = \
        """
            UPDATE request
            SET owner_accepted=True
            WHERE id = {rid}
        """.format(rid=request_id)

        self.crs.execute(update_acceptance_query)

        # check to see if target account is specified (based on incentive type)
        incentive_retrieval_query = \
        """
            SELECT incentive.type
            FROM incentive
            INNER JOIN request_incentive ri
                ON incentive.id = ri.incentive_id
                AND ri.request_id = {rid}
        """.format(rid=request_id)

        incentive_type = self.crs.fetch_first(incentive_retrieval_query)

        if incentive_type == 'user_fee' and 'target_account' in record:
            # update request record with target account information
            target_account = int(record['target_account'])

            update_request_query = \
            """
                UPDATE request
                SET target_account={tacc}
                WHERE id = {rid}
            """.format(rid=request_id, tacc=target_account)

            self.crs.execute(update_request_query)

            # invoke fund transfer operation and send notif to receiver
            success = self.transfer_funds(request_id)

            if not success:
                self.error_logs.append(
                    "Fund transfer was unable to take place.")

                return False

        # retrieve all blocks for this particular request
        block_retrieval_query = \
        """
            SELECT req.resource_id, rsb.block_start, rsb.block_end
            FROM request req
            INNER JOIN request_schedule_blocks rsb
                ON req.id = rsb.request_id
            WHERE req.id = {rid}
        """.format(rid=request_id)

        retrieved_blocks = self.crs.fetch_dict(block_retrieval_query)

        # transform retrieved blocks
        expected_dt_format = '%Y-%m-%d %H:%M'

        for block in retrieved_blocks:
            for fld, val in block.iteritems():
                if fld == 'block_start' or fld == 'block_end':
                    # convert datetime object to string
                    block[fld] = val.strftime(expected_dt_format)

            # add block recurring field before running through pipeline
            block['block_recurring'] = {}

        # use scheduling pipeline to upload blocks
        schedpipe = SchedulePipeline(user_id=self.get_requester_id(request_id))

        success, errors = \
            schedpipe.run(retrieved_blocks, init_availability=False, block_availability=False)

        if not success:
            return False

        self.error_logs += errors

        # create notification to requester that request has been accepted
        message = "Request with id %s has been accepted by owner." % request_id

        if 'message' in record:
            new_msg = \
            """
            {original_msg}

            OWNER PERSONAL MESSAGE
            ----------------------
            {owner_msg}
            """

            message = new_msg.format(
                original_msg=message, owner_msg=str(record['message']))

        _, notification_id = self.notif_util.create_notification(
            self.get_requester_id(request_id), message)

        self.crs.commit()

        return True

    def reject_request(self):
        """
            Underlying method to undergo request rejection process.
        """
        record = self.df_transform.iloc[0]

        request_id = int(record['request_id'])

        # update owner rejected flag in request record
        update_rejection_query = \
        """
            UPDATE request
            SET owner_rejected=True
            WHERE id = {rid}
        """.format(rid=request_id)

        self.crs.execute(update_rejection_query)

        # create notification to requester that request has been rejected
        message = "Request with id %s has been rejected by owner." % request_id

        if 'message' in record:
            new_msg = \
            """
            {original_msg}

            OWNER PERSONAL_MESSAGE
            ----------------------
            {owner_msg}
            """

            message = new_msg.format(
                original_msg=message, owner_msg=str(record['message']))

        _, notification_id = self.notif_util.create_notification(
            self.get_requester_id(request_id), message)

        self.crs.commit()

        return True

    def submit_request(self, data):
        """
            Main method invoked by requester to submit all request-related
            information for approval/rejection by resource owner.

            Parameters
            ----------
            data : {list}
                list of dictionaries containing request data. Each data point
                should correspond to a submitted request for a particular
                resource.
        """
        if not isinstance(data, list) or len(data) == 0:
            self.error_logs.append("Invalid or empty data list provided.")
            return False, self.error_logs, None

        self.data = data

        self.transform()

        # custom transformation for underlying blocks
        self.df_transform['transformed_block_list'] = \
            self.df_transform['requested_blocks'].apply(
                lambda x: self.block_transform(x))

        self.df_transform['requested_blocks'] = \
            self.df_transform['transformed_block_list']

        self.df_transform.drop('transformed_block_list', inplace=True, axis=1)

        self.load()

        self.create_request_packages()

        return True, self.error_logs, self.final_requests

    def accept_reject_request(self, decision, data):
        """
            Main method invoked by owner to accept or reject a request.

            Parameters
            ----------
            decision : {str}
                decision made by the owner. the only two options are 'accept' or
                'reject'.

            data : {dict}
                data dictionary corresponding to decision being passed
        """
        if decision != 'accept' and decision != 'reject':
            self.error_logs.append("Invalid decision submitted by the owner.")
            return False, self.error_logs

        elif not isinstance(data, dict):
            self.error_logs.append("Invalid data type for passed data.")
            return False, self.error_logs

        self.data = [data]

        self.transform()

        if decision == "accept":
            success = self.accept_request()

        elif decision == "reject":
            success = self.reject_request()

        return success, self.error_logs

    def get_requests(self, owner_id):
        """
            Main method to retrieve all requests for a given user. This user
            is the owner of all of the resources for which requests were
            submitted. The only requests to be returned are ones that are
            neither accepted nor rejected.

            Parameters
            ----------
            owner_id : {int}
                unique identifer of resource owner
        """
        # retrieve basic and incentive-based attributes across all requests
        request_retrieval_query = \
        """
            SELECT 
                req.id, req.resource_id, req.user_id as requester_id,
                pu.first_name || ' ' || pu.last_name as requester_name,
                inc.type as incentive_type, uf.fee_amount, 
                uf.cadence as fee_cadence
            FROM request req
            INNER JOIN platform_user pu
                ON req.user_id = pu.id
            INNER JOIN resource_user rus
                ON req.resource_id = rus.resource_id
            INNER JOIN request_incentive ri
                ON req.id = ri.request_id
            INNER JOIN incentive inc
                ON ri.incentive_id = inc.id
            LEFT JOIN user_fee uf
                ON inc.fee_id = uf.id
            WHERE rus.user_id = {owner_id}
                AND req.owner_accepted = False
                AND req.owner_rejected = False
        """.format(owner_id=owner_id)

        request_data = self.crs.fetch_dict(request_retrieval_query)

        # special handling of decimal fields
        decimal_fields = ['fee_amount']

        for req in request_data:
            for fld, val in req.iteritems():
                if fld in decimal_fields:
                    req[fld] = float(val)

        # restructure data to allow eventual merge
        placeholder = {}

        for elem in request_data:
            if elem['id'] not in placeholder:
                placeholder[elem['id']] = elem

        request_data = placeholder.values()

        # retrieve block list for all requests
        block_retrieval_query = \
        """
            SELECT rsb.request_id, rsb.block_start, rsb.block_end
            FROM request_schedule_blocks rsb
            INNER JOIN request req
                ON rsb.request_id = req.id
            INNER JOIN resource_user rus
                ON req.resource_id = rus.resource_id
                AND rus.user_id = {owner_id}
        """.format(owner_id=owner_id)

        block_data = self.crs.fetch_dict(block_retrieval_query)

        # special handling of datetime objects
        for block in block_data:
            for fld, val in block.iteritems():
                if isinstance(val, dt.datetime):
                    # convert datetime objects to iso strings
                    block[fld] = val.isoformat()

        placeholder = {}

        for elem in block_data:
            if elem['request_id'] not in placeholder:
                placeholder[elem['request_id']] = []

            placeholder[elem['request_id']].append(
                {fld: elem[fld] for fld in elem if fld != 'request_id'})

        block_data = placeholder

        # merge init attributes and block list
        for elem in request_data:
            elem['block_list'] = \
                block_data[elem['id']] if elem['id'] in block_data else []

        return request_data


if __name__ == '__main__':
    requ = RequestUtil()
