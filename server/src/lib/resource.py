"""
    Module to aid with retrieval of resource objects.
"""
from decimal import Decimal

import pandas as pd
import datetime as dt

from pipeline import Pipeline


class ResourceUtil(Pipeline):
    def __init__(self):
        # use pipeline class for database fields utility
        super(ResourceUtil, self).__init__("resource.json")

    def _clean_result(self):
        """
            Helper method to clean resource data (i.e. make it JSON compatible).
        """
        type_dict = \
            {str: str, bool: bool, Decimal: float, int: int, float: float,
             list: list, dict: dict}

        cleaned_store = []

        for data_point in self.resource_data:
            placeholder = {}

            for fld, val in data_point.iteritems():
                # use 'resource_id' instead of 'id' for consistency
                if fld == 'id':
                    fld = 'resource_id'
                # postgres bug: ownerId camel case does not persist
                elif fld == 'ownerid':
                    fld = 'ownerId'

                # assume one-level nesting
                if isinstance(val, dict):
                    for _fld, _val in val.iteritems():
                        val[_fld] = type_dict[type(_val)](_val)
                    placeholder[fld] = val
                    continue

                elif isinstance(val, list):
                    for idx, elem in enumerate(val):
                        val[idx] = type_dict[type(elem)](elem)
                    placeholder[fld] = val
                    continue

                elif isinstance(val, type(None)):
                    placeholder[fld] = val

                placeholder[fld] = type_dict[type(val)](val)

            cleaned_store.append(placeholder)

        self.resource_data = cleaned_store

    def _get_resource_data(self):
        """
            Underlying method to retrieve attributes for specified resources.
        """
        where_clause = ""

        if len(self.resource_list) > 0:
            res_list = ",".join([str(res) for res in self.resource_list])

            where_clause = "WHERE resource.id IN (%s)" % res_list

        resource_fields = self.database_fields['resource']

        resource_fields = \
            ",".join(["resource.%s" % fld for fld in resource_fields])

        # assumption for now is that user_fee is the only incentive type
        retrieval_query = \
        """
            SELECT {res_fields}, incentive.type as incentive_type,
                uf.fee_amount, uf.cadence as fee_cadence, 
                ru.user_id as ownerId

            FROM resource
            
            INNER JOIN resource_user ru
                ON resource.id = ru.resource_id

            INNER JOIN resource_incentive ri
                ON resource.id = ri.resource_id

            INNER JOIN incentive
                ON ri.incentive_id = incentive.id

            LEFT JOIN user_fee uf
                ON incentive.fee_id = uf.id

            {where_clause}
        """.format(res_fields=resource_fields, where_clause=where_clause)

        result = self.crs.fetch_dict(retrieval_query)

        self.resource_data = {}

        for dct in result:
            self.resource_data[dct['id']] = dct

        # special handling of location data (dictionary creation)
        where_clause = ""

        if len(self.resource_list) > 0:
            where_clause = "WHERE resloc.resource_id IN (%s)" % res_list

        location_fields = self.database_fields['location']

        location_fields = \
            ",".join(["location.%s" % fld for fld in location_fields])

        location_retrieval_query = \
        """
            SELECT resloc.resource_id, {loc_flds}
            FROM location
            INNER JOIN resource_location resloc
            ON location.placeId = resloc.location_id
            {where_clause}
        """.format(loc_flds=location_fields, where_clause=where_clause)

        result = self.crs.fetch_dict(location_retrieval_query)

        placeholder_data = {}

        for dct in result:
            placeholder_data[dct['resource_id']] = \
                {fld:val for fld, val in dct.iteritems() if 
                 fld != ['resource_id']}

        for rid, dct in self.resource_data.iteritems():
            dct.update({'location': placeholder_data[rid]})

        self.resource_data = self.resource_data.values()

        return

    def _get_schedule_data(self):
        """
            Underlying method to retrieve scheduling information for specified
            resources.
        """
        avail_where_clause = ""
        block_where_clause = ""

        if len(self.resource_list) > 0:
            res_list = ",".join([str(res) for res in self.resource_list])

            avail_where_clause = "WHERE resource_id IN (%s)" % res_list
            block_where_clause = "WHERE resource_id IN (%s)" % res_list

        avail_fields = ",".join(self.database_fields['resource_availability'])

        avail_retrieval_query = \
        """
            SELECT {fields}
            FROM resource_availability
            {where_clause}
        """.format(fields=avail_fields, where_clause=avail_where_clause)

        avail_result = self.crs.fetch_dict(avail_retrieval_query)

        placeholder_dict = {}

        for dct in avail_result:
            placeholder_dict[dct['resource_id']] = dct

        self.resource_data = placeholder_dict

        block_fields = \
            ",".join(self.database_fields['resource_schedule_blocks'])

        block_retrieval_query = \
        """
            SELECT {fields}
            FROM resource_schedule_blocks
            {where_clause}
        """.format(fields=block_fields, where_clause=block_where_clause)

        block_result = self.crs.fetch_dict(block_retrieval_query)

        for dct in block_result:
            # iterate through each block and add to list of dicts in main
            # resource dictionary
            resid = dct['resource_id']

            # block-specific cleanup and transformations
            dp = {}

            for key, val in dct.iteritems():
                if key == 'resource_id':
                    continue
                elif isinstance(val, dt.datetime):
                    dp[key] = val.isoformat()
                    continue

                dp[key] = val

            if 'block_list' not in self.resource_data[resid]:
                self.resource_data[resid]['block_list'] = []

            self.resource_data[resid]['block_list'].append(dp)

        self.resource_data = self.resource_data.values()
        
        placeholder_store = []

        # schedule-specific cleanup and transformations
        for dct in self.resource_data:
            dp = {}

            for key in dct:
                if isinstance(dct[key], dt.datetime) or \
                    isinstance(dct[key], dt.date):
                    dp[key] = dct[key].isoformat()
                    continue

                dp[key] = dct[key]

            placeholder_store.append(dp)

        self.resource_data = placeholder_store

        return

    def get_common_data_points(self):
        """
            Propagation method used to invoke underlying methods for retrieval
            of common resource attributes.
        """
        self._get_resource_data()

    def get_schedule_data_points(self):
        """
            Propagation method used to invoke underlying methods for retrieval
            of scheduling-related data points.
        """
        self._get_schedule_data()

    def get_resource_data(self, resource_list, dataset="common"):
        """
            Main method to retrieve data for a list of resources.

            Parameters
            ----------
            resource_list : {list}
                list of unique resource identifiers for which data is to be
                retrieved. If empty list is passed, then data for all resources
                are retrieved.

            dataset : {str}
                corresponds to the type of data to be returned. valid options
                are common, schedule
        """
        self.resource_data = []

        if not isinstance(resource_list, list):
            self.error_logs.append("Invalid format for resource list.")
            return False, self.error_logs, []

        self.resource_list = resource_list

        if dataset == "common":
            self.get_common_data_points()
            self._clean_result()

        elif dataset == "schedule":
            self.get_schedule_data_points()

        return True, self.error_logs, self.resource_data


if __name__ == '__main__':
    resutil = ResourceUtil()

    resutil.get_resource_data([], dataset="schedule")
