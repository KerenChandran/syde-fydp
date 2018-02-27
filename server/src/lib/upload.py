"""
    Upload resource pipeline. Supports single and bulk uploads with appropriate
    transformation and load logic.
"""

from pipeline import Pipeline

import pdb


class UploadPipeline(Pipeline):
    def __init__(self):
        super(UploadPipeline, self).__init__("upload.json")


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

            # ignore resource_id column
            update_cols = ["%s=%s" % tup for tup in update_cols 
                           if tup[0] != 'resource_id']

            update_query = \
            """
                UPDATE resource
                SET {update_cols}
                WHERE id = {rid}
                RETURNING id;
            """.format(update_cols=",".join(update_cols), 
                       rid=record['resource_id'])

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


    def incentive_load(self, record):
        """
            Main method to load incentive information into postgres table.
            Even if the resource information is being updated, a new incentive
            record is created. The update takes place within the relationship
            table.

            Parameters
            ----------
            record : {pandas.Series}
                Data point for incentive information to be uploaded.
        """
        flds, incentive_data = self.crs.sanitize(record)

        incentive_dict = dict(zip(flds, incentive_data))

        # create incentive
        incentive_upload_query = \
        """
            INSERT INTO incentive (type)
            VALUES ({type})
            RETURNING id;
        """.format(type=incentive_dict['incentive_type'])

        incentive_id = self.crs.fetch_first(incentive_upload_query)

        # if user fee is present create a user fee record and update incentive
        if incentive_dict['incentive_type'] == "'user_fee'":
            fee_amount = incentive_dict['fee_amount']

            fee_cadence = incentive_dict['fee_cadence']

            uf_upload_query = \
            """
                INSERT INTO user_fee (fee_amount, cadence)
                VALUES ({amount}, {cadence})
                RETURNING id;
            """.format(amount=fee_amount, cadence=fee_cadence)

            uf_id = self.crs.fetch_first(uf_upload_query)

            # update incentive record to reflect newly added fee id
            incentive_update_query = \
            """
                UPDATE incentive
                SET fee_id={ufid}
                WHERE id={incentive_id}
            """.format(ufid=uf_id, incentive_id=incentive_id)

            self.crs.execute(incentive_update_query)

        return incentive_id


    def load(self):
        """
            Main method to load transformed data into postgres tables.
        """
        # check to see if an update is taking place
        update_flag = \
            True if "resource_id" in self.df_transform.columns else False

        # handle resource data
        resource_fields = self.database_fields['resource']
        resource_fields = \
            list(set(resource_fields) & set(self.df_transform.columns))

        if update_flag:
            df_resource = self.df_transform[resource_fields + ['resource_id']]
        else:
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

        # handle incentive data
        incentive_fields = self.database_fields['incentive']
        incentive_fields = \
            list(set(incentive_fields) & set(self.df_transform.columns))

        df_incentive = self.df_transform[incentive_fields]

        self.df_transform['incentive_id'] = \
            df_incentive.apply(lambda x: self.incentive_load(x), axis=1)

        # add or update incentive and resource records in join table
        upload_query = \
        """
            INSERT INTO resource_incentive (resource_id, incentive_id)
            VALUES ({rid}, {iid})
        """

        update_query = \
        """
            UPDATE resource_incentive
            SET incentive_id = {iid}
            WHERE resource_id = {rid}
        """

        res_inc_query = update_query if update_flag else upload_query

        self.df_transform.apply(
            lambda x: self.crs.execute(
                res_inc_query.format(rid=x['resource_id'], iid=x['incentive_id'])),
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
