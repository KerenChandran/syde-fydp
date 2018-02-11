import os
import json

import pandas as pd

from utils.db import Cursor
from utils.es import Connect

class Pipeline(object):
    def __init__(self, json_filename):
        # all cursors and connections
        self.crs = Cursor()

        self.esconn = Connect()

        json_filepath = os.path.join(os.path.dirname(__file__), json_filename)

        json_content = json.load(open(json_filepath))

        # field mappings
        self.mappings = json_content['mappings']

        # database table and field mappings
        self.database_fields = json_content['database_fields']

        self.parse_mappings()

        # error logs to propagate to method which invoked class run method
        self.error_logs = []

    def parse_mappings(self):
        """
            Helper function to parse JSON mappings and generate
            Python-compatible mapping dictionary for transformation phase.
        """
        new_mappings = {}

        nested_fields = []

        def parse_mappings_recurse(mapping_dict, parent_dict):
            """
                Recursive function used to 'flatten' the nested mapping
                dictionary.

                Parameters
                ----------
                mapping_dict : {dict}
                    mapping dictionary to parse/flatten

                parent_dict : {str}
                    field name for which the underlying data type is a
                    dictionary that needs to be further flattened.
            """

            for elem in mapping_dict:
                if mapping_dict[elem]['data_type'] == 'dictionary':
                    nested_fields.append(elem)

                    parse_mappings_recurse(
                        mapping_dict[elem]['dictionary_fields'], elem)

                    continue

                if parent_dict is not None:
                    # change the field name to reflect its nested nature
                    prefix = parent_dict + '_'
                else:
                    prefix = ''

                if mapping_dict[elem]['data_type'] == 'float':
                    new_mappings[prefix + elem] = float

                elif mapping_dict[elem]['data_type'] == 'integer':
                    new_mappings[prefix + elem] = int

                elif mapping_dict[elem]['data_type'] == 'boolean':
                    new_mappings[prefix + elem] = bool

                else:
                    # default text data type
                    new_mappings[prefix + elem] = str

            return

        parse_mappings_recurse(self.mappings, None)

        self.nested_fields = nested_fields

        self.parsed_mappings = new_mappings

    def typecast(self, fld, value, datatype):
        """
            Helper function to apply safe casting of data type. Propagates empty
            (i.e. None) value if cast cannot be applied.

            Parameters
            ----------
            fld : {str}
                Corresponding field of the passed value. Used for error
                reporting purposes.

            value : {ambiguous}
                Value to be casted based on passed datatype.

            datatype : {ambiguous}
                Datatype to cast passed value to.
        """
        try:
            val = datatype(value)

        except:
            self.error_logs.append(
                "Passed value %s for %s could not be casted" % (fld, value))

            return 'NULL'

        return val

    def transform(self):
        """
            Main function to transform underlying fields for a given set
            of data points.
        """
        # standardize set of columns across all data points
        col_set = None

        for record in self.data:
            if col_set is None:
                col_set = set(record.keys())
                continue

            col_set = col_set & set(record.keys())

        # find intersection with mapped columns
        col_set = \
            col_set & set(self.parsed_mappings.keys() + self.nested_fields)

        df = pd.DataFrame(self.data)

        df = df[list(col_set)]

        # columns with 'nested' datatypes (e.g. dict) need to be flattened
        # iterate through nested columns as found by JSON mappings and flatten
        for col in self.nested_fields:
            if col not in df.columns:
                continue

            inner_col_set = set(sum([record.keys() for record in df[col]], []))

            for inner_col in inner_col_set:
                newcol = '%s_%s' % (col, inner_col)
                df[newcol] = df[col].apply(lambda x: x[inner_col])

            # remove parent column
            df.drop(col, axis=1, inplace=True)

        for col in df.columns:
            df[col] = df[col].apply(
                lambda x: self.typecast(col, x, self.parsed_mappings[col]))

        self.df_transform = df

        return True