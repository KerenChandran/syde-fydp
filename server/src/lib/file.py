"""
    Module to aid with photo and file uploads and downloads.
"""
import uuid
import os

from utils.db import Cursor


class FileUtil:
    def __init__(self, image_dir=None, file_dir=None):
        """
            Constructor for file utility.

            Parameters
            ----------
            image_dir : {str}
                absolute path for directory which is to store images

            file_dir : {str}
        """
        self.image_dir = image_dir
        self.file_dir = file_dir

        self.crs = Cursor()

        self.error_logs = []

        self.valid_entities = ['resource', 'user']

    def valid_resource(self, resource_id):
        """
            Helper method which checks to see whether a resource is valid.

            Parameters
            ----------
            resource_id : {int}
                unique identifer of resource being validated
        """
        resource_check_query = \
        """
            SELECT id
            FROM resource
            WHERE id = {rid}
        """.format(rid=resource_id)

        return self.crs.check_record_present(resource_check_query)

    def valid_user(self, user_id):
        """
            Helper method which checks to see whether a passed user is valid.

            Parameters
            ----------
            user_id : {int}
                unique identifier of user being validated
        """
        user_check_query = \
        """
            SELECT id
            FROM platform_user
            WHERE id = {uid}
        """.format(uid=user_id)

        return self.crs.check_record_present(user_check_query)

    def generate_name(self, entity_id, filename, filetype):
        """
            Helper method to generate a new filename.

            Parameters
            ----------
            entity_id : {int}
                unique identifier of entity

            filename : {str}
                original name of file.

            filetype : {str}
                type of file being uploaded
        """
        suffix = ".".split(filename)[-1]

        uid = uuid.uuid4()

        new_flnm = "_".join([str(resource_id), filetype, uid])

        new_flnm += "." + suffix

        return filename, new_flnm

    def _resource_file_upload(self, resource_id, file, file_type, image_type=None, misc_type=None):
        """
            Underlying method which helps in uploading a file for a resource.

            Parameters
            ----------
            These parameters are the same as the keyword-arguments in
            upload_file(), under a 'resource' entity_type, with the addition
            of a file object.
        """
        if not self.valid_resource(resource_id):
            self.error_logs.append("Invalid resource specified via id.")
            return False

        type_mappings = {
            "image_file": {
                "target_table": "image",
                "mapping_table": "resource_image",
                "type_field": "image_type",
                "mapping_id_field": "image_id",
                "type": image_type,
                "target_directory": self.image_dir 
            },
            "misc_file": {
                "target_table": "misc_file",
                "mapping_table": "resource_misc_file",
                "type_field": "file_type",
                "mapping_id_field": "file_id",
                "type": misc_type,
                "target_directory": self.file_dir
            }
        }

        # generate unique name for file
        orig_flnm, new_flnm = self.generate_name(
            resource_id, file.filename, type_mappings[file_type]["type"])

        # save file
        try:
            flpath = os.path.join(
                type_mappings[file_type]['target_directory'], new_flnm)

            file.save(flpath)

        except:
            self.error_logs.append("Unable to upload file.")
            return False

        # add record to database
        file_addition_query = \
        """
            INSERT INTO {target_tbl} ({type_fld}, generated_filename, original_filename)
            VALUES ('{fl_type}', '{flnm}', '{orig}')
            RETURNING id;
        """.format(target_tbl=type_mappings[file_type]['target_table'], 
                   type_fld=type_mappings[file_type]['type_field'],
                   fl_type=type_mappings[file_type]['type'],
                   flnm=new_flnm, orig=orig_flnm)
        
        file_id = self.crs.fetch_first(file_addition_query)

        # add resource file mapping
        resource_file_map_query = \
        """
            INSERT INTO {mapping_tbl} (resource_id, {map_id_fld})
            VALUES ({rid}, {fid})
        """.format(mapping_tbl=type_mappings[file_type]['mapping_table'],
                   map_id_fld=type_mappings[file_type]['mapping_id_field'],
                   rid=resource_id, fid=file_id)

        return True

    def _user_file_upload(self, user_id, file):
        """
            Underlying method which helps in uploading a file for a resource.
            The current supported file type for users is 'image_file'

            Parameters
            ----------
            These parameters are the same as the keyword-arguments in
            upload_file(), under a 'user' entity_type, with the addition of a
            file object.
        """
        if not self.valid_user(user_id):
            self.error_logs.append("Invalid user specified via id.")
            return False

        # generate unique name for file
        orig_flnm, new_flnm = self.generate_name(
            user_id, file.filename, "user")

        try:
            flpath = os.join(self.image_dir, new_flnm)

            file.save(flpath)

        except:
            self.error_logs.append("Unable to upload user image.")
            return False

        # add record to database
        file_addition_query = \
        """
            INSERT INTO image (image_type, generated_filename, original_filename)
            VALUES ('user', '{flnm}', '{orig}')
            RETURNING id;
        """.format(flnm=new_flnm, orig=orig_flnm)

        file_id = self.crs.fetch_first(file_addition_query)

        # add user file mapping
        user_file_map_query = \
        """
            INSERT INTO user_image (user_id, image_id)
            VALUES ({uid}, {fid})
        """.format(uid=user_id, fid=file_id)

        return True

    def upload_file(self, entity_type, file, **kwargs):
        """
            Main method to upload a file for a particular resource.

            Parameters
            ----------
            entity_type : {str}
                type of entity for which file is being uploaded. An entity
                corresponds to one of 'resource' or 'user'.

            file : {file}
                file object corresponding to file being uploaded.

            Keyword-Arguments
            -----------------
            Keyword Arguments vary based on the entity passed as param.

            [entity_type == 'resource']
            resource_id : {int}
                unique identifier of resource for which file is being uploaded.

            file_type : {str}
                type of file being uploaded. A file corresponds to one of
                'image_file', 'misc_file'

            image_type : {str} [conditional]
                optional parameter based on whether the uploaded file is an
                image. An image corresponds to one of 'resource' or 'accessory'

            misc_type : {str} [conditional]
                optional parameter based on whether the uploaded file is of
                misc type. No constraints in terms of parameter values

            [entity_type == 'user']
            user_id : {int}
                unique identifier of user for which image is being uploaded.
        """
        if entity_type not in {'resource': None, 'user': None}:
            self.error_logs.append("Invalid entity type submitted.")
            return False, self.error_logs
        elif file is None:
            self.error_logs.append("Empty file passed to upload utility.")
            return False, self.error_logs

        if entity_type == "resource":
            resource_id = kwargs['resource_id']

            file_type = kwargs['file_type']

            if kwargs['image_type'] is None and kwargs['misc_type'] is None:
                self.error_logs.append(
                    "Type of resource file being uploaded was not specified.")
                return False, self.error_logs
            
            elif file_type == 'image_file' and kwargs['image_type'] is None:
                self.error_logs.append(
                    "Specify image type for image file upload.")
                return False, self.error_logs

            elif file_type == 'misc_file' and kwargs['misc_type'] is None:
                self.error_logs.append(
                    "Specify misc type for misc file upload.")
                return False, self.error_logs

            image_type = \
                kwargs['image_type'] if 'image_type' in kwargs else None

            misc_type = kwargs['misc_type'] if 'misc_type' in kwargs else None

            success = self._resource_file_upload(
                resource_id, file, file_type, image_type=image_type, 
                misc_type=misc_type)

        elif entity_type == "user":
            user_id = kwargs['user_id']

            success = self._user_file_upload(user_id, file)

        return success, self.error_logs

    def get_uploaded_files(self, entity_id, entity_type):
        """
            Main method to get a data package containing information about
            image and file uploads for a particular entity.

            Parameters
            ----------
            entity_id : {int}
                unique identifier of entity for which file information is to
                be retrieved

            entity_type : {str}
                type of entity for which file information is being retrieved.
                Valid types are 'user' and 'resource'.
        """
        if entity_type == 'resource' and not self.valid_resource(entity_id):
            self.error_logs.append("Invalid resource id specified.")
            return False, self.error_logs, None
        elif entity_type == 'user' and not self.valid_user(entity_id):
            self.error_logs.append("Invalid user id specified.")
            return False, self.error_logs, None

        if entity_type == 'resource':
            file_retrieval_query = \
            """
                SELECT 
                    img.image_type as type, img.generated_filename as filename,
                    img.original_filename
                FROM image img
                INNER JOIN resource_image ri
                    ON img.id = ri.image_id
                    AND ri.resource_id = {rid}

                UNION

                SELECT 
                    mf.file_type as type, mf.generated_filename as filename,
                    mf.original_filename
                FROM misc_file mf
                INNER JOIN resource_misc_file rmf
                    ON mf.id = rmf.file_id
                    AND rmf.resource_id = {rid}
            """.format(rid=entity_id)

        elif entity_type == 'user':
            file_retrieval_query = \
            """
                SELECT 
                    img.image_type as type, img.generated_filename as filename,
                    img.original_filename
                FROM image img
                INNER JOIN user_image ui
                    ON img.id = ui.image_id
                    AND ui.user_id = {uid}
            """.format(uid=entity_id)

        result = self.crs.fetch_dict(file_retrieval_query)

        data_package = {}

        for fl_info in result:
            if fl_info['type'] not in data_package:
                data_package['type'] = []

            data_package['type'].append({
                'filename': fl_info['filename'],
                'original_filename': fl_info['original_filename']
            })

        return data_package


if __name__ == '__main__':
    file_util = FileUtil()
