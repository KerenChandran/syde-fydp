"""
    Module with class and module definitions specific to resource scheduling.
"""
import datetime as dt

from dateutil.relativedelta import relativedelta
import pandas as pd

from pipeline import Pipeline


class SchedulePipeline(Pipeline):
    def __init__(self, user_id=None):
        super(SchedulePipeline, self).__init__("schedule.json")

        self.user_id = user_id if user_id is not None else None

        self.generated_blocks = []

        self.expected_date_format = '%Y-%m-%d'

        self.expected_datetime_format = '%Y-%m-%d %H:%M'

        self.cadence_map = {
            'daily': relativedelta(days=1),
            'weekly': relativedelta(weeks=1),
            'biweekly': relativedelta(weeks=2),
            'monthly': relativedelta(months=1) 
        }

    def check_resource_existence(self, resource_id):
        """
            Helper method to check if initial availability was already specified
            for the passed resource.

            Parameters
            ----------
            resource_id : {int}
                unique resource identifier
        """
        check_resource_query = \
        """
            SELECT resource_id
            FROM resource_availability
            WHERE resource_id = {id}
        """.format(id=resource_id)

        return self.crs.check_record_present(check_resource_query)

    def generate_blocks(self, resource_id, block_start, block_end, block_recurring={}):
        """
            Helper method to generate blockage data points for a particular
            resource based on the passed block specs and recurrence.

            Parameters
            ----------
            resource_id : {int}
                unique resource identifier

            block_start : {str}
                datetime formatted string representing the start of the block

            block_end : {str}
                datetime formatted string representing the end of the block

            block_recurring : {dict}
                block recurrence details. if this dictionary is empty the block
                is assumed to have a single occurence. 
        """
        if len(block_recurring) == 0:
            # empty dictionary - single occurence
            self.generated_blocks.append(
                {'resource_id': resource_id, 'block_start': block_start, 
                 'block_end': block_end})

            return

        # generate multiple block records based on recurrence
        block_start = dt.datetime.strptime(
            block_start, self.expected_datetime_format)

        block_end = dt.datetime.strptime(
            block_end, self.expected_datetime_format)

        start_date = dt.datetime.strptime(
            block_recurring['start'], self.expected_date_format)

        end_date = dt.datetime.strptime(
            block_recurring['end'], self.expected_date_format)

        if start_date > end_date:
            self.error_logs.append(
                "Invalid recurrence bounds for %s" % resource_id)

            return

        # relative time delta preserves days and minutes
        time_increment = self.cadence_map[block_recurring['cadence']]

        while start_date < end_date:
            # generate block record
            record = {
                'resource_id': resource_id, 
                'block_start': block_start.strftime(self.expected_datetime_format),
                'block_end': block_end.strftime(self.expected_datetime_format)
            }

            self.generated_blocks.append(record)

            # increment block start/end, and start date based on cadence
            start_date = start_date + time_increment
            block_start = block_start + time_increment
            block_end = block_end + time_increment

        return

    def get_generated_blocks(self):
        """
            Helper method to retrieve all blocks generated from pipeline.
        """
        return self.generated_blocks

    def check_block_overlap(self, resource_id, block_start, block_end, 
        availability=False, custom_target=None):
        """
            Helper method to check if the specified block overlaps with
            an existing one.

            Parameters
            ----------
            resource_id : {int}
                unique resource identifier

            block_start : {str}
                datetime formatted string representing the start of the block

            block_end : {str}
                datetime formatted string representing the end of the block

            availability : {bool}
                flag to specify whether overlap check is being applied to
                availability blocks (reverse check from regular scheduling)

            custom_target : {str}
                name of target table. used for custom overlap checks with
                different target tables and normal schedule overlap check
        """
        target_table = "resource_availability_blocks" if availability else \
        "resource_schedule_blocks"

        target_table = custom_target if custom_target else target_table

        # safe check of whether overlap is present - could be optimized with SQL
        block_retrieval_query = \
        """
            SELECT block_start, block_end
            FROM {target}
            WHERE resource_id = {rid}
        """.format(target=target_table, rid=resource_id)

        existing_blocks = self.crs.fetch_dict(block_retrieval_query)

        block_start = \
            dt.datetime.strptime(block_start, self.expected_datetime_format)

        block_end = \
            dt.datetime.strptime(block_end, self.expected_datetime_format)

        overlap_flag = False

        for block in existing_blocks:
            start_check = \
                (block['block_start'] <= block_start <= block['block_end'])

            end_check = \
                (block['block_start'] <= block_end <= block['block_end'])

            if availability:
                if start_check and end_check:
                    # check to see whether start and end of block exists
                    # within an availability block
                    overlap_flag = True
                    break
            else:
                if start_check or end_check:
                    # check to see whether start and end of block overlaps
                    # within a schedule block
                    overlap_flag = True
                    break

        if availability:
            error_msg = \
                "Resource %s can't be added with block %s => %s as the block" \
                + "does not lie within an availability zone."

            if not overlap_flag:
                self.error_logs.append(
                    error_msg % (resource_id, block_start, block_end))

            return overlap_flag

        error_msg = \
            "Resource %s can't be added with block %s => %s due to overlap."

        if overlap_flag:
            self.error_logs.append(
                error_msg % (resource_id, block_start, block_end))

        return not overlap_flag

    def init_availability_load(self, record, update_flag=False):
        """
            Main method to load initial availability data for a particular
            resource. Init availability updating is also supported.

            Parameters
            ----------
            record : {pandas.Series}
                Data point for availability to be uploaded

            update_flag : {bool}
                flag specifying whether an update is taking place
        """
        flds, record_data = self.crs.sanitize(record)

        upload_query = \
        """
            INSERT INTO resource_availability ({cols})
            VALUES ({vals})
        """.format(cols=",".join(flds), vals=",".join(record_data))

        execution_query = upload_query

        if update_flag:
            resource_id = record['resource_id']

            update_cols = zip(flds, record_data)
            update_cols = ["%s=%s" % tup for tup in update_cols]

            update_query = \
            """
                UPDATE resource_availability
                SET {update_cols}
                WHERE resource_id = {rid}
            """

            execution_query = update_query

        self.crs.execute(execution_query)

        return True

    def block_scheduling_load(self, record, target_table):
        """
            Main method to load block schedule for the passed resource.

            Parameters
            ----------
            record : {pandas.Series}
                Data point for usage block to be uploaded.

            target_table : {str}
                target table to load block data into.
        """
        flds, record_data = self.crs.sanitize(record)

        # single user per pipeline run and bulk block upload
        flds.append("user_id")
        record_data.append(str(self.user_id))

        upload_query = \
        """
            INSERT INTO {target} ({cols})
            VALUES ({vals})
            RETURNING block_id;
        """.format(target=target_table, cols=",".join(flds), 
                   vals=",".join(record_data))

        block_id = self.crs.fetch_first(upload_query)

        return block_id

    def load(self, init_availability=True, block_scheduling=True, block_availability=True):
        """
            Main method in which underlying load methods are applied to
            transformed dataframe. Flags are used to determine which underlying
            method should be invoked as sometimes the use cases for the two
            are independent of one another.

            Parameters
            ----------
            init_availability : {bool}
                flag specifying whether initial availability loading should
                be conducted.

            block_scheduling : {bool}
                flag specifying whether block scheduling loading should be
                conducted.

            block_availability : {bool}
                flag specifying whether availability block loading should be
                conducted. 
        """
        availability_df = None
        block_sched_df = None

        if init_availability:
            # initial availability loading
            availability_df = \
                self.df_transform[self.database_fields['resource_availability']]

            # find all resources for which an update is required
            update_list = availability_df['resource_id'].apply(
                lambda x: self.check_resource_existence(x))

            update_map = dict(zip(availability_df['resource_id'], update_list))

            availability_df['load_flag'] = availability_df.apply(
                lambda x: self.init_availability_load(x, 
                    update_map[x['resource_id']]), 
                axis=1)

        if block_scheduling or block_availability:
            # consistent fields across both available and schedule tables
            db_flds = self.database_fields['resource_schedule_blocks']

            # add 'block_recurring' to database fields as it is not a valid col
            db_flds.append('block_recurring')

            sched_df = self.df_transform[db_flds]

            # generate blocks for both schedule and availability load
            sched_df.apply(
                lambda x: self.generate_blocks(
                    x['resource_id'], x['block_start'], x['block_end'], 
                    block_recurring=x['block_recurring']),
                axis=1)

            block_sched_df = pd.DataFrame(self.generated_blocks)

            if block_scheduling:
                # step which checks that schedule loaded blocks
                # lie within availability blocks
                block_sched_df = block_sched_df[block_sched_df.apply(
                    lambda x: self.check_block_overlap(
                        x['resource_id'], x['block_start'], x['block_end'],
                        availability=True),
                    axis=1)]

                # step to check whether schedule loaded blocks overlap
                # with existing blocks for that particular resource
                block_sched_df = block_sched_df[block_sched_df.apply(
                    lambda x: self.check_block_overlap(
                        x['resource_id'], x['block_start'], x['block_end']),
                    axis=1)]

                # define target table for load step
                target_table = "resource_schedule_blocks"

            elif block_availability:
                # step to check whether availabilty loaded blocks overlap
                # with existing availability blocks (sanity)
                target_table = "resource_availability_blocks"

                block_sched_df = block_sched_df[block_sched_df.apply(
                    lambda x: self.check_block_overlap(
                        x['resource_id'], x['block_start'], x['block_end'],
                        custom_target=target_table),
                    axis=1)]

            if not block_sched_df.empty:
                # only add new cols to non-empty dataframes after overlap 
                # check
                block_sched_df['block_id'] = block_sched_df.apply(
                    lambda x: self.block_scheduling_load(x, target_table), 
                    axis=1)

        self.crs.commit()

        return (availability_df, block_sched_df)

    def run(self, data, init_availability=True, block_scheduling=True, block_availability=True):
        """
            Main method to run scheduling pipeline for initial availability
            and bulk scheduling upload.

            Parameters
            ----------
            data : {list}
                list of dictionaries containing scheduling data. Each data point
                corresponds to either initial availability specification or
                block scheduling.

            init_availability : {bool}
                flag specifying whether initial availability loading should
                be conducted. Propagates to pipeline load method.

            block_scheduling : {bool}
                flag specifying whether block scheduling loading should be
                conducted. Propagates to pipeline load method.

            block_availability : {bool}
                flag specifying whether availability block loading should be
                conducted. Propagates to pipeline load method.

            Mutual Exclusivity
            ------------------
            block_scheduling and block_availability flags cannot be set
            together.
        """
        if not isinstance(data, list) or len(data) == 0:
            self.error_logs.append("Empty data store passed for uploading.")
            return (False, self.error_logs)
        elif block_scheduling and block_availability:
            self.error_logs.append(
                "Pipeline only supports either availability or scheduling load.")
            return (False, self.error_logs)

        self.data = data

        self.transform()

        avail_df, bsched_df = \
            self.load(init_availability=init_availability,
                      block_scheduling=block_scheduling,
                      block_availability=block_availability)

        return (True, self.error_logs)

    def intermediate_availability_load(self):
        """
            Main method in which underlying generation and load methods are 
            applied to data set enabling the hypothetical loading of 
            availability information in an intermediary table.
        """
        db_flds = self.database_fields['intermediate_availability_blocks']

        db_flds.append('block_recurring')

        avail_df = self.df_transform[db_flds]

        # generate blocks based on passed data
        avail_df.apply(
            lambda x: self.generate_blocks(
                x['resource_id'], x['block_start'], x['block_end'], 
                block_recurring=x['block_recurring']),
            axis=1)
        
        block_df = pd.DataFrame(self.generated_blocks)

        # check whether generated blocks overlap with existing ones
        target_table = "intermediate_availability_blocks"

        block_df = block_df[block_df.apply(
            lambda x: self.check_block_overlap(
                x['resource_id'], x['block_start'], x['block_end'],
                custom_target=target_table),
            axis=1)]

        block_df = block_df[['block_start', 'block_end']]

        return block_df.to_dict('records')

    def intermediate_availability_flush(self, resource_id):
        """
            Main method in which intermediate availability data is flushed out
            of database tables for a particular resource.

            Parameters
            ----------
            resource_id : {int}
                unique identifier of resource for which data is being flushed
                out
        """
        data_removal_query = \
        """
            DELETE FROM intermediate_availability_blocks
            WHERE resource_id = {rid}
        """.format(rid=resource_id)

        self.crs.execute(data_removal_query)

        return True, self.error_logs

    def intermediate_availability_run(self, existing_data, new_block):
        """
            Main method to run scheduling pipeline for intermediary availability
            loads.

            Parameters
            ----------
            existing_data : {list}
                list of dictionarieis containing existing availability data.
                Each data point mirrors block scheduling data points (i.e.
                resource identifier, start, end, and recurring information).

            new_block : {dict}
                data point for the new block to be 'loaded'. should include
                information about start, end, and recurring.
        """
        if not isinstance(existing_data, list):
            self.error_logs.append("Invalid existing data store.")
            return False, self.error_logs, None
        elif not isinstance(new_block, dict) or len(new_block) == 0:
            self.error_logs.append("Invalid new block specified.")
            return False, self.error_logs, None
        
        # create resource record
        resource_insertion_query = \
        """
            INSERT INTO resource (description)
            VALUES ('placeholder_resource')
            RETURNING id;
        """

        resource_id = self.crs.fetch_first(resource_insertion_query)

        if len(existing_data) > 0:
            # run pipeline on existing data points with custom load step
            self.data = existing_data

            self.transform()

            self.df_transform['resource_id'] = resource_id

            # insert existing blocks into intermediary table
            target_table = "intermediate_availability_blocks"

            self.df_transform.apply(
                lambda x: self.block_scheduling_load(x, target_table), axis=1)

        # run pipeline on new data point and return generated blocks
        self.data = [new_block]

        self.transform()

        self.df_transform['resource_id'] = resource_id

        result = self.intermediate_availability_load()

        # remove all previously loaded data points
        self.intermediate_availability_flush(resource_id)

        return True, self.error_logs, result


class ScheduleFilter(Pipeline):
    """
        Engine class used for main schedule filtering tasks.
    """
    def __init__(self):
        # use pipeline super class for transformation utils.
        super(ScheduleFilter, self).__init__("schedule_filter.json")

        self.timedelta_map = {
            'hours': lambda x: dt.timedelta(hours=x),
            'days': lambda x: dt.timedelta(days=x),
            'weeks': lambda x: dt.timedelta(weeks=x)
        }

        self.expected_date_format = '%Y-%m-%d'

    def _check_overlap(self, block_start, block_end, block_list, required_duration):
        """
            Helper method with checks to see whether a passed 'block'
            overlaps with any of the blocks in the passed list, and whether
            said overlap satisfies the overlap criterion.

            Parameters
            ----------
            block_start : {datetime.datetime}
                start of the block being checked

            block_end : {datetime.datetime}
                end of the block being checked

            block_list : {list}
                list of blocks to check overlaps against

            required_duration : {datetime.timedelta}
                required duration for overlap
        """
        criterion_met = False
        start = None
        end = None

        for block in block_list:
            # first check: is there no overlap whatsoever
            if block_end < block['block_start'] or \
                block_start > block['block_end']:
                continue

            # second check: does the check block sit within the iterator block
            within_check = \
                block_start >= block['block_start'] and \
                block_end <= block['block_end']

            if within_check:
                # sanity overlap duration check
                if block_end - block_start >= total_duration:
                    overlap_flag = True
                    start = block_start
                    end = block_end
                    break

            # third check: does the check block envelop the iterator block
            envelope_check = \
                block_start < block['block_start'] and \
                block_end > block['block_end']

            if envelope_check:
                # this check might have already taken place but conduct for
                # sanity
                if block['block_end'] - block['block_start'] >= total_duration:
                    overlap_flag = True
                    start = block['block_start']
                    end = block['block_end']
                    break

            # fourth check: does the check block start before the iterator block
            early_check = block_start < block['block_start']

            if early_check:
                # check that the overlap satisfies the duration criterion
                if block_end - block['block_start'] >= total_duration:
                    overlap_flag = True
                    start = block['block_start']
                    end = block['block_end']
                    break

            # fifth check: does the check block end after the iterator block
            late_check = block_end > block['block_end']

            if late_check:
                # check that the overlap satisfies the duration criterion
                if block['block_end'] - block_start >= total_duration:
                    overlap_flag = True
                    start = block_start
                    end = block['block_end']
                    break

        return overlap_flag, start, end

    def _duration_filter(self):
        """
            Helper method used to retrieve resources for which the
            duration criterion is met. For an hourly duration constraint, there
            must exist x hours within the time frame of 8AM - 8PM.
        """
        # retrieve all usage/requested blocks
        retrieve_block_query = \
        """
            SELECT resource_id, block_start, block_end
            FROM resource_schedule_blocks
        """

        usage_blocks = self.crs.fetch_dict(retrieve_block_query)

        # find all resources for which usage blocks do not exist
        # these are resources that automatically satisfy the filtering criterion
        usage_resource_list = \
            list(set([block['resource_id'] for block in usage_blocks]))

        valid_resources = \
            list(set(self.availability_blocks.keys()) - set(usage_resource_list))

        # create first set of final resources
        self.final_resources = {}

        for rid in valid_resources:
            # availability block list
            abl = self.availability_blocks[rid]
            abl = [block['block_start'] for block in abl]
            abl = sorted(abl)

            self.final_resources[rid] = abl[0]

        # transform usage block list to map resource id to underlying blocks
        placeholder = {}

        for block in usage_blocks:
            if block['resource_id'] not in placeholder:
                placeholder[block['resource_id']] = \
                    [block['block_start'], block['block_end']]
                continue

            placeholder[block['resource_id']] += \
                [block['block_start'], block['block_end']]

        usage_blocks = placeholder

        # sort usage blocks so that consecutive block spaces can be computed
        usage_blocks = {rid: sorted(blocks) for rid, blocks in usage_blocks}

        # block overlaps cannot exist so all block start and ends are adjacent -
        # iterate through each resource and check to see if there exist
        # contiguous blocks that match the filtering criterion

        valid_usage_blocks = {rid: [] for rid in usage_blocks}

        total_duration = self.timedelta_map[self.dtype](self.dquantity)

        for rid, blocks in usage_blocks.iteritems():
            # first check: does the start of the first block happen after the
            # start of the window
            start_check = self.start < blocks[0]

            if start_check:
                # does the 'space' exceed the required duration
                space_check = blocks[0] - self.start >= total_duration

                if space_check:
                    # does the modified block fit in an availability block
                    # of the underlying resource
                    overlap, start, end = self._check_overlap(
                        self.start, blocks[0], self.availability_blocks[rid], 
                        total_duration)

                    if overlap:
                        valid_usage_blocks[rid].append(start)
                        continue

            # iterate through all remaining blocks
            for idx in range(1, len(blocks), 2):
                if idx == len(blocks) - 1:        
                    # check: does space exist between the last block and the end
                    # of the window
                    end_check = blocks[idx] < self.end

                    if end_check:
                        # does the 'space' exceed the required duration
                        space_check = self.end - blocks[idx] >= total_duration

                        if space_check:
                            # does the modified block fit in an availability 
                            # block of the underlying resource
                            overlap, start, end = self._check_overlap(
                                blocks[idx], self.end, 
                                self.availability_blocks[rid], total_duration)

                            if overlap:
                                valid_usage_blocks[rid].append(self.end)
                                continue

                # check: does space exist between the current block end
                # and the start of the next block
                space_check = blocks[idx+1] - blocks[idx] > total_duration

                if space_check:
                    # does the current space fit within an availability block
                    # of the underlying resource
                    overlap, start, end = self._check_overlap(
                        blocks[idx], blocks[idx+1], 
                        self.availability_blocks[rid], 
                        total_duration)

                    if overlap:
                        valid_usage_blocks[rid].append(self.end)

        valid_usage_blocks = {rid: blocks for rid, blocks in 
                              valid_usage_blocks.iteritems() if len(blocks) > 0}

        for rid, blocks in valid_usage_blocks.iteritems():
            self.final_resources[rid] = sorted(blocks)[0]

        self.final_resources = \
            zip(self.final_resources.keys(), self.final_resources.values())

        self.final_resources = \
            sorted(self.final_resources, key=lambda x: x[1])

        self.final_resources = \
            [(lst[0], lst[1].isoformat()) for lst in self.final_resources]

    def _availability_filter(self):
        """
            Helper method to filter resources based on their availability
            blocks.
        """
        # retrieve all resource availability blocks
        block_retrieval_query = \
        """
            SELECT resource_id, block_start, block_end
            FROM resource_availability_blocks
        """

        availability_blocks = self.crs.fetch_dict(block_retrieval_query)

        # container to store resources and valid availability blocks
        unique_resources = \
            list(set([block['resource_id'] for block in availability_blocks]))

        availability_store = {rid: [] for rid in unique_resources}

        # iterate through each availability block and check validity
        for block in availability_blocks:
            # first check: is there no overlap between the block and the window
            no_overlap_check = \
                block['block_end'] < self.start or \
                block['block_start'] > self.end

            if no_overlap_check:
                # we ignore this block altogether
                continue

            # second check: does the window sit within the availability block
            # skip duration criterion as we can assume that required duration
            # is within the availability window
            window_within_check = \
                self.start >= block['block_start'] and \
                self.end <= block['block_end']

            if window_within_check:
                # create modified block to reflect window
                mod_block = {'block_start': self.start, 'block_end': self.end}

                availability_store[block['resource_id']].append(mod_block)
                continue

            # third check: does the block sit within the window and if so
            # does the block duration match the passed criterion
            block_within_check = \
                block['block_start'] > self.start and \
                block['block_end'] < self.end

            timedelta_check = block['block_end'] - block['block_start'] >= \
                self.timedelta_map[self.dtype](self.dquantity)

            if block_within_check and timedelta_check:
                availability_store[block['resource_id']].append(block)
                continue

            # fourth check: does the block start before the window and if so
            # is the overlap between the block and window longer than the
            # required duration
            block_starts_before_window = block['block_start'] < self.start

            timedelta_check = block['block_end'] - self.start >= \
                self.timedelta_map[self.dtype](self.dquantity)

            if block_starts_before_window and timedelta_check:
                # create a modified block to reflect overlap
                mod_block = \
                    {'block_start': self.start, 'block_end': block['block_end']}

                availability_store[block['resource_id']].append(mod_block)
                continue

            # fifth check: does the block end after the window and if so
            # is the overlap between the block and window longer than the
            # required duration
            block_ends_after_window = block['block_end'] > self.end

            timedelta_check = self.end - block['block_start'] >= \
                self.timedelta_map[self.dtype](self.dquantity)

            if block_ends_after_window and timedelta_check:
                # create modified block to reflect overlap
                mod_block = \
                    {'block_start': block['block_start'], 'block_end': self.end}

                availability_store[block['resource_id']].append(mod_block)
                continue

        self.availability_blocks = \
            {rid: block for rid, block in availability_store.iteritems() if
             len(block) > 0}

    def _filter(self):
        """
            Private method containing all of the filtering logic given
            the criterion parameters as passed to filter().
        """
        record = self.df_transform.iloc[0]

        self.start = record['window_start']

        self.end = record['window_end']

        # convert start and end dates
        self.start = dt.datetime.strptime(self.start, self.expected_date_format)

        self.end = dt.datetime.strptime(self.end, self.expected_date_format)

        self.dtype = record['duration_type']

        self.dquantity = record['duration_quantity']

        self._availability_filter()

        self._duration_filter()

        return

    def filter(self, init_window, preferred_duration):
        """
            Main function used to obtain a set of resources which match a very
            specific filtering criterion. The filtering criterion is composed of
            two parts:

            1. Initial Window - a min/max date spec denoting an initial window 
            in which the user wishes to borrow the resource.

            2. Duration - a contiguous block of specified type for which the 
            user wishes to block the resource. The method does not currently 
            support the specification of recurrence.

            Parameters
            ----------
            init_window : {tuple}
                Tuple containing information about the window for which 
                the user wishes to borrow the resource. Each tuple element must
                contain strings compatible with the python date.date type.

            preferred_duration : {dict}
                Data object containing information about the requested duration
                for which the user intends to use/block the resource. This 
                object contains strictly two properties:
                    1. type: hours, days, weeks {str}. 
                        If an hourly type is selected then it is recommended
                        that the duration is less than 12 (i.e. 8AM - 8PM
                        block). For durations that exceed 12 hours, it is
                        recommended that the daily type is selected.
                    2. quantity: length of contiguous block {int}
                        The minimum block length must be one for any of the
                        duration types.
        """
        if not isinstance(init_window, tuple) or len(init_window) != 2:
            self.error_logs.append("Incorrect initial window specification.")
            return (False, self.error_logs)
        elif not isinstance(preferred_duration, dict) or \
            len(preferred_duration) == 0:
            self.error_logs.append(
                "Incorrect preferred duration specification.")
            return (False, self.error_logs)

        window_start, window_end = init_window

        duration_type = preferred_duration["type"]

        duration_quantity = preferred_duration["quantity"]

        if duration_quantity < 1:
            self.error_logs.append("Minimum block length must be 1.")
            return (False, [], self.error_logs)

        elif duration_type == 'hours' and duration_quantity > 12:
            self.error_logs.append(
                "Hourly duration cannot exceed 12 units. Please use daily type."
            )
            return (False, [], self.error_logs)

        data_obj = {
            "window_start": window_start,
            "window_end": window_end,
            "duration_type": preferred_duration["type"],
            "duration_quantity": preferred_duration["quantity"]
        }

        self.data = [data_obj]

        self.transform()

        self._filter()

        return (True, self.final_resources, self.error_logs)


if __name__ == '__main__':
    schedpipe = SchedulePipeline()

    schedfilt = ScheduleFilter()
