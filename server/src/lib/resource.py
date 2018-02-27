"""
    Module to aid with retrieval of resource objects.
"""
from decimal import Decimal

import pandas as pd

from pipeline import Pipeline

import pdb


class ResourceUtil(Pipeline):
    def __init__(self):
        # use pipeline class for database fields utility
        super(ResourceUtil, self).__init__("resource.json")

    def _clean_result(self):
        """
            Helper method to clean resource data (i.e. make it JSON compatible).
        """
        type_dict = \
            {str: str, bool: bool, Decimal: float, int: int, float: float}

        for data_point in self.resource_data:
            for fld, val in data_point.iteritems():
                # assume one-level nesting
                if isinstance(val, dict):
                    for _fld, _val in val.iteritems():
                        val[_fld] = type_dict[type(_val)](_val)
                    data_point[fld] = val
                    continue

                elif isinstance(val, list):
                    for idx, elem in enumerate(val):
                        val[idx] = type_dict[type(elem)](elem)
                    data_point[fld] = val
                    continue

                data_point[fld] = type_dict[type(val)](val)

    def _get_resource_data(self):
        """
            Underlying method to retrieve attributes for specified resources.
        """
        where_clause = ""

        if len(self.resource_list) > 0:
            res_list = ",".join(str(res) for res in self.resource_list)

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

    def get_resource_data(self, resource_list):
        """
            Main method to retrieve data for a list of resources.

            Parameters
            ----------
            resource_list : {list}
                list of unique resource identifiers for which data is to be
                retrieved. If empty list is passed, then data for all resources
                are retrieved.
        """
        if not isinstance(resource_list, list):
            self.error_logs.append("Invalid format for resource list.")
            return False, self.error_logs, []

        self.resource_list = resource_list

        self._get_resource_data()

        self._clean_result()

        return True, self.error_logs, self.resource_data


if __name__ == '__main__':
    resutil = ResourceUtil()

    resutil.get_resource_data([])
