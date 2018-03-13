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

    def block_scheduling_load(self, record, availability=False):
        """
            Main method to load block schedule for the passed resource.

            Parameters
            ----------
            record : {pandas.Series}
                Data point for usage block to be uploaded.

            availability : {bool}
                flag denoting whether it is an availability load, as opposed
                to schedule
        """
        flds, record_data = self.crs.sanitize(record)

        # single user per pipeline run and bulk block upload
        flds.append("user_id")
        record_data.append(str(self.user_id))

        target_table = "resource_availability_blocks" if availability else \
            "resource_schedule_blocks"

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
                    lambda x: self.block_scheduling_load(
                        x, availability=block_availability), 
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


class ScheduleFilter(Pipeline):
    """
        Engine class used for main schedule filtering tasks.
    """
    def __init__(self):
        # use pipeline super class for transformation utils.
        super(ScheduleFilter, self).__init__("schedule_filter.json")

        self.reldelta_map = {
            'hours': lambda x: relativedelta(hours=x),
            'days': lambda x: relativedelta(days=x),
            'weeks': lambda x: relativedelta(weeks=x)
        }

        self.timedelta_map = {
            'hours': lambda x: dt.timedelta(hours=x),
            'days': lambda x: dt.timedelta(days=x),
            'weeks': lambda x: dt.timedelta(weeks=x)
        }

    def _window_filter(self):
        """
            Helper method used to get the resulting resource dataframe after
            applying the window criterion.
        """
        resource_fetch_query = \
        """
            SELECT DISTINCT resource_id
            FROM resource_availability
            WHERE availability_start <= '{window_start}'
                OR availability_end >= '{window_end}'
        """.format(window_start=self.start, window_end=self.end)

        self.resource_df = self.crs.fetch_dataframe(resource_fetch_query)

    def _duration_filter(self):
        """
            Helper method used to retrieve resources for which the
            duration criterion is met. For an hourly duration constraint, there
            must exist x hours within the time frame of 8AM - 8PM.
        """
        retrieve_block_query = \
        """
            SELECT resource_id, block_start, block_end
            FROM resource_schedule_blocks
        """

        resource_blocks = self.crs.fetch_dict(retrieve_block_query)
            
        # flatten retrieved resource blocks
        resource_store = {}

        for elem in resource_blocks:
            if elem['resource_id'] not in resource_store:
                resource_store[elem['resource_id']] = \
                    [elem['block_start'], elem['block_end']]

                continue

            resource_store[elem['resource_id']] += \
                [elem['block_start'], elem['block_end']]

        # sort all block elements - returned as datetime objects
        for res, dt_list in resource_store.iteritems():
            resource_store[res] = sorted(dt_list)
        
            # sanity check
            assert(len(resource_store[res]) % 2 == 0)

        # block overlaps cannot exist so all block start and ends are adjacent
        # iterate through each resource and check to see if there exists
        # at least one contiguous block that matches the filtering criterion
        # only interested in the timedelta between block_end and block_start
        resource_flags = {}

        for res in resource_store:
            if res not in resource_flags:
                resource_flags[res] = {
                    'match': False,
                    'valid_starts': []
                }

        # convert availability start and end dates to datetime objects
        expected_date_format = '%Y-%m-%d'

        self.start = dt.datetime.strptime(self.start, expected_date_format)
        self.end = dt.datetime.strptime(self.end, expected_date_format)

        for res, dtlist in resource_store.iteritems():
            # initial checks:
            # 1) do blocks exist for this particular resource
            # 2) does avail start + timedelta overlap w/ first block
            if len(dtlist) == 0 or \
                self.start + self.reldelta_map[self.dtype](self.dquantity) < dtlist[0]:
                resource_flags[res]['match'] = True

                resource_flags[res]['valid_starts'].append(self.start)

            for idx in range(1, len(dtlist), 2):
                if idx == len(dtlist) - 1:
                    # last element
                    # check to see if timedelta exists between last block
                    # and window end
                    if dtlist[idx] + self.reldelta_map[self.dtype](self.dquantity) < self.end:
                        resource_flags[res]['match'] = True

                        resource_flags[res]['valid_starts'].append(dtlist[idx])
                    
                    continue

                # check to see if the timedelta between current block_end
                # and next block_start matches filtering criterion
                # use strictly less than conditional to allow for small buffers
                if dtlist[idx] + self.reldelta_map[self.dtype](self.dquantity) < dtlist[idx+1]:
                    resource_flags[res]['match'] = True

                    resource_flags[res]['valid_starts'].append(dtlist[idx])

        # retrieve all resources that match the criterion
        self.duration_resources = \
            {res: data['valid_starts'] for res, data in 
             resource_flags.iteritems() if data['match']}

        self.duration_resources = {res: sorted(data) for res, data in 
                                   self.duration_resources.iteritems()}

    def _availability_filter(self):
        """
            Helper method to filter resources based on their availability
            blocks.
        """
        block_retrieval_query = \
        """
            SELECT resource_id, block_start, block_end
            FROM resource_availability_blocks
        """

        avail_dict = self.crs.fetch_dict(block_retrieval_query)

        self.avail_resources = {}

        # iterate through each resource and block to see whether
        # an availability block exists that corresponds to required duration
        for block in avail_dict:
            if block['resource_id'] in self.avail_resources:
                # this is already a valid resource
                continue

            # check that the block exists within the required window
            boundary_check = block['block_start'] > self.start and \
                block['block_end'] < self.end

            timedelta_check = block['block_end'] - block['block_start'] >= \
                self.timedelta_map[self.dtype](self.dquantity)

            if (boundary_check and timedelta_check):
                if block['resource_id'] not in self.avail_resources or \
                    self.avail_resources[block['resource_id']] > block['block_start']:
                    # prioritize earlier availability start
                    self.avail_resources[block['resource_id']] = block['block_start']

        # find all available resources that do not have any usage blocks
        resource_retrieval_query = \
        """
            SELECT DISTINCT resource_id AS rid
            FROM resource_schedule_blocks
        """

        resource_list = self.crs.fetch_dict(resource_retrieval_query)

        resource_list = {dp['rid']: None for dp in resource_list}

        store = {}

        for res, block_start in self.avail_resources.iteritems():
            if res not in resource_list:
                store[res] = block_start

        self.avail_resources = store

        # transform avail dict to map resources to availability blocks
        placeholder = {}

        for dp in avail_dict:
            data = {'start': dp['block_start'], 'end': dp['block_end']}

            if dp['resource_id'] not in placeholder:
                placeholder[dp['resource_id']] = [data]
                continue

            placeholder[dp['resource_id']].append(data)

        avail_dict = placeholder

        store = {}

        # iterate through resources that passed the duration criterion
        for res, blocks in self.duration_resources.iteritems():
            # check to see that the resource meets first pass availability
            if res not in avail_dict:
                continue

            # iterate through each contiguous block
            for block_start in blocks:
                
                valid_block = False

                # iterate through availability blocks for this resource
                for av_block in avail_dict[res]:
                    if valid_block:
                        break

                    # check to see if the contig block fits in avail block
                    check_1 = block_start >= av_block['start']
                    check_2 = \
                        block_start + self.reldelta_map[self.dtype](self.dquantity) \
                        <= av_block['end']

                    if check_1 and check_2:
                        valid_block = True
                        continue

                if valid_block:
                    if res not in store:
                        store[res] = [block_start]
                        continue

                    store[res].append(block_start)

        for res in store:
            store[res] = sorted(store[res])
            store[res] = store[res][0]

        self.avail_resources.update(store)

        self.final_resources = self.avail_resources

        self.final_resources = \
            zip(self.final_resources.keys(), self.final_resources.values())

        self.final_resources = \
            sorted(self.final_resources, key=lambda x: x[1])

        self.final_resources = \
            [(lst[0], lst[1].isoformat()) for lst in self.final_resources]


    def _filter(self):
        """
            Private method containing all of the filtering logic given
            the criterion parameters as passed to filter().
        """
        record = self.df_transform.iloc[0]

        self.start = record['window_start']

        self.end = record['window_end']

        self.dtype = record['duration_type']

        self.dquantity = record['duration_quantity']

        # self._window_filter()

        self._duration_filter()

        self._availability_filter()

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
