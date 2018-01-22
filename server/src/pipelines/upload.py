"""
    Upload resource pipeline. Supports single and bulk uploads with appropriate
    transformation and load logic.
"""

import os
import json

import pandas as pd

from utils.db import Cursor
from utils.es import Connect


class UploadPipeline:
    def __init__(self):
        # all cursors and connections
        self.crs = Cursor()

        self.esconn = Connect()

        json_filepath = os.path.join(os.path.dirname(__file__), "upload.json")

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


    def resource_load(self, record, update=False, **kwargs):
        """
            Main method to load transformed resource data into postgres 
            table.

            Parameters
            ----------
            record : {pandas.Series}
                Data point for resource to be uploaded.

            update : {boolean}
                Flag which explicitly states whether update is taking place.

            Keyword-Arguments
            -----------------
            resource_id : {int}
                Identifier or resource for which values are being updated.
        """
        flds, resource_data = self.crs.sanitize(record)

        upload_query = \
        """
            INSERT INTO resource ({cols})
            VALUES ({insert_data})
            RETURNING id;
        """.format(cols=",".join(flds), insert_data=",".join(resource_data))

        execution_query = upload_query

        if update:
            update_cols = zip(flds, resource_data)
            update_cols = ["%s=%s" % (tup[0], tup[1]) for tup in update_cols]

            update_query = \
            """
                UPDATE resource
                SET {update_cols}
                WHERE id = {rid}
            """.format(update_cols=",".join(update_cols), 
                       rid=kwargs['resource_id'])

            execution_query = update_query

        resource_id = self.crs.fetch_first(execution_query)

        return resource_id


    def location_load(self, record):
        """
            Main method to load transformed location data into postgres table.
            The expectation is that location data does not get updated (coming
            from third party).

            Parameters
            ----------
            record : {pandas.Series}
                Data point for location to be uploaded.
        """
        # check if location is already present in the database
        check_query = \
        """
            SELECT placeId
            FROM location
            WHERE placeId = '{id}'
        """.format(id=record['location_placeId'])

        if self.crs.check_record_present(check_query):
            return record['location_placeId']

        flds, location_data = self.crs.sanitize(record)

        # need to clean fields for compatibility with SQL tables
        compatible_flds = ["_".join(fld.split("_")[1:]) for fld in flds]

        upload_query = \
        """
            INSERT INTO location ({cols})
            VALUES ({insert_data})
            RETURNING placeId;
        """.format(cols=",".join(compatible_flds), 
                   insert_data=",".join(location_data))

        place_id = self.crs.fetch_first(upload_query)

        return place_id


    def load(self):
        """
            Main method to load transformed data into postgres tables.
        """
        # check to see if an update is taking place
        update_flag = \
            True if "resource_id" in self.df_transform.columns else False

        # handle resource data
        resource_fields = self.database_fields['resource']

        df_resource = self.df_transform[resource_fields]

        self.df_transform['resource_id'] = df_resource.apply(
            lambda x: self.resource_load(x, update=update_flag), axis=1)

        # handle location data - nested fields
        location_fields = self.database_fields['location']
        location_fields = ['location_%s' % fld for fld in location_fields]

        df_location = self.df_transform[location_fields]

        # create duplicate place_id for persistence with SQL upload
        self.df_transform['place_id'] = \
            df_location.apply(lambda x: self.location_load(x), axis=1)

        # add or update location and resource records to join table
        upload_query = \
        """
            INSERT INTO resource_location (resource_id, location_id)
            VALUES ({rid}, '{lid}')
        """

        update_query = \
        """
            -- resource already exists so we update the location
            -- single resource cannot be mapped to multiple locations
            UPDATE resource_location
            SET location_id = '{lid}'
            WHERE resource_id = {rid}
        """

        res_loc_query = update_query if update_flag else upload_query

        self.df_transform.apply(
            lambda x: self.crs.execute(
                res_loc_query.format(rid=x['resource_id'], lid=x['place_id'])), 
            axis=1)

        # TODO: all of the following logic up until adding to resource_user
        # will be deprecated once profile creation functionality is present
        # right now all we do is create a user id if it does not exist 
        user_check_query = \
        """
            SELECT id
            FROM platform_user
            WHERE id = {id}
        """

        # boolean slicing of dataframe to obtain all users to add to database
        user_check_series = self.df_transform.apply(
            lambda x: not self.crs.check_record_present(
                user_check_query.format(id=x['ownerId'])),
            axis=1)

        df_users = self.df_transform[user_check_series]

        # add single occurrence of unique owner
        df_users.drop_duplicates(subset=['ownerId'], inplace=True)

        add_user_query = \
        """
            INSERT INTO platform_user (id)
            VALUES ({id})
        """

        df_users.apply(
            lambda x: self.crs.execute(add_user_query.format(id=x['ownerId'])),
            axis=1)

        # add user and resource records to join table

        upload_query = \
        """
            INSERT INTO resource_user (resource_id, user_id)
            VALUES ({rid}, {uid})
        """

        self.df_transform.apply(
            lambda x: self.crs.execute(
                upload_query.format(rid=x['resource_id'], uid=x['ownerId'])),
            axis=1)

        self.crs.commit()

        return True


    def run(self, data):
        """
            Main function to run pipeline for resource upload.

            Parameters
            ----------
            data : {list}
                list of dictionaries containing resource data. In the case of 
                single uploads, the list is expected to only contain one 
                resource dictionary. 
        """
        if not isinstance(data, list) or len(data) == 0:
            self.error_logs.append("Empty data store passed for uploading.")
            return (False, self.error_logs, None)

        self.data = data

        self.transform()

        self.load()

        return (True, self.error_logs, self.df_transform)


if __name__ == '__main__':
    upip = UploadPipeline()
