"""
    Module with class and module definitions specific to resource scheduling.
"""
import datetime as dt

from dateutil.relativedelta import relativedelta
import pandas as pd

from pipeline import Pipeline
from utils.db import Cursor


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

    def check_block_overlap(self, resource_id, block_start, block_end):
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
        """
        # safe check of whether overlap is present - could be optimized with SQL
        block_retrieval_query = \
        """
            SELECT block_start, block_end
            FROM resource_schedule_blocks
            WHERE resource_id = {rid}
        """.format(rid=resource_id)

        existing_blocks = self.crs.fetch_dict(block_retrieval_query)

        dt_convert = \
            lambda x: dt.datetime.strptime(x, self.expected_datetime_format)

        existing_blocks = map(
            lambda x: {'bstart': dt_convert(x['block_start']), 
                       'bend': dt_convert(x['block_end'])},
            existing_blocks)

        overlap_flag = False

        for block in existing_blocks:
            if (block['bstart'] <= block_start <= block['bend']) or \
                (block['bstart'] <= block_end <= block['bend']):
                overlap_flag = True
                break

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

    def block_scheduling_load(self, record):
        """
            Main method to load block schedule for the passed resource.

            Parameters
            ----------
            record : {pandas.Series}
                Data point for usage block to be uploaded.
        """
        flds, record_data = self.crs.sanitize(record)

        # single user per pipeline run and bulk block upload
        flds.append("user_id")
        record_data.append(str(self.user_id))

        upload_query = \
        """
            INSERT INTO resource_schedule_blocks ({cols})
            VALUES ({vals})
            RETURNING block_id;
        """.format(cols=",".join(flds), vals=",".join(record_data))

        block_id = self.crs.fetch_first(upload_query)

        return block_id

    def load(self, init_availability=True, block_scheduling=True):
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

            block_cheduling : {bool}
                flag specifying whether block scheduling loading should be
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

        if block_scheduling:
            # block scheduling load
            db_flds = self.database_fields['resource_schedule_blocks']

            # add 'block_recurring' to database fields as it is not a valid col
            db_flds.append('block_recurring')

            sched_df = self.df_transform[db_flds]

            sched_df.apply(
                lambda x: self.generate_blocks(
                    x['resource_id'], x['block_start'], x['block_end'], 
                    block_recurring=x['block_recurring']),
                axis=1)

            block_sched_df = pd.DataFrame(self.generated_blocks)

            block_sched_df = block_sched_df[block_sched_df.apply(
                lambda x: self.check_block_overlap(
                    x['resource_id'], x['block_start'], x['block_end']),
                axis=1)]

            block_sched_df['block_id'] = block_sched_df.apply(
                lambda x: self.block_scheduling_load(x), axis=1)

        self.crs.commit()

        return (availability_df, block_sched_df)

    def run(self, data, init_availability=True, block_scheduling=True):
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

            block_cheduling : {bool}
                flag specifying whether block scheduling loading should be
                conducted. Propagates to pipeline load method.
        """
        if not isinstance(data, list) or len(data) == 0:
            self.error_logs.append("Empty data store passed for uploading.")
            return (False, self.error_logs, None)

        self.data = data

        self.transform()

        avail_df, bsched_df = \
            self.load(init_availability=init_availability,
                      block_scheduling=block_scheduling)

        return (True, self.error_logs)


class ScheduleFilter:
    """
        Engine class used for main schedule filtering tasks.
    """
    def __init__(self):
        # use pipeline super class for transformation utils.
        super(SchedulePipeline, self).__init__("schedule_filter.json")

        self.timedelta_map = {
            'hours': lambda x: relativedelta(hours=x),
            'days': lambda x: relativedelta(days=x),
            'weeks': lambda x: relativedelta(weeks=x)
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
                AND availability_end >= '{window_end}'
        """.format(window_start=self.start, window_end=self.end)

        self.resource_df = self.crs.fetch_dataframe(resource_fetch_query)

    def _duration_filter(self):
        """
            Helper method used to retrieve resources for which the
            duration criterion is met. For an hourly duration constraint, there
            must exist x hours within the time frame of 8AM - 8PM.
        """
        resource_list = self.resource_df['resource_id'].tolist()
        resource_list = [str(x) for x in resource_list]

        retrieve_block_query = \
        """
            SELECT resource_id, block_start, block_end
            FROM resource_schedule_blocks
            WHERE resource_id IN ({resource_list})
        """.format(",".join(resource_list))

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

        # convert all block elements into datetime objects and sort
        for res, dt_list in resource_store.iteritems():
            resource_store[res] = \
                sorted([dt.datetime.strptime(x) for x in dt_list])
        
            # sanity check
            assert(len(resource_store[res]) % 2 == 0)

        # block overlaps cannot exist so all block start and ends are adjacent
        # iterate through each resource and check to see if there exists
        # at least one contiguous block that matches the filtering criterion
        # only interested in the timedelta between block_end and block_start
        resource_flags = {res: (False, None) for res in resource_store}

        for res in resource_store:
            for idx in range(1, len(resource_store[res]), 2):
                if idx == len(resource_store[res]) - 1:
                    # last element so we skip
                    continue
                elif resource_flags[res][0]:
                    # move to next resource
                    break

                # check to see if the timedelta between current block_end
                # and next block_start matches filtering criterion
                # use strictly less than conditional to allow for small buffers
                if res[idx] + self.timedelta_map[self.dtype] < res[idx+1]:
                    resource_flags[res][0] = True
                    resource_flags[res][1] = res[idx]

        # retrieve all resources that match the criterion
        self.final_resources = \
            [res for res in resource_flags if resource_flags[res][0]]

        # sort final resources by availability
        self.final_resources = \
            sorted(self.final_resources, key=lambda x: x[1])

        expected_datetime_format = '%Y-%m-%d %H:%M'

        self.final_resources = \
            [(tup[0], dt.datetime.strftime(tup[1])) for tup in 
             self.final_resources]

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

        self._window_filter()

        self._duration_filter()

        return

    def filter(self, init_window, preferred_duration):
        """
            Main function used to obtain a set of resources which match a very
            specific filtering criterion. The filtering criterion is composed of
            two parts:

            1. Initial Window - a min/max date spec denoting an initial window 
            in which the user wishes to borrow the resource. This component is 
            pit against the initial availability of the resource as specified by
            the resource owner.

            2. Duration - a contiguous block of specified type for which the 
            user wishes to block the resource. The method does not currently 
            support the specification of recurrence.

            Parameters
            ----------
            init_window : {tuple}
                Tuple containing information about the initial window for which 
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
        if not isinstance(init_window, tuple) or len(tuple) != 2:
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
            return (False, self.error_logs)

        elif duration_type == 'hours' and duration_quantity > 12:
            self.error_logs.append(
                "Hourly duration cannot exceed 12 units. Please use daily type."
            )
            return (False, self.error_logs)

        data_obj = {
            "window_start": init_window[0],
            "window_end": init_window[1],
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
