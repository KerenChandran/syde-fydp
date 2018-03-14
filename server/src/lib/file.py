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

    def generate_name(self, resource_id, filename, filetype):
        """
            Helper method to generate a new filename.

            Parameters
            ----------
            resource_id : {int}
                unique identifier of resource

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


    def upload_image(self, resource_id, image, image_type="resource"):
        """
            Main method to upload an image for a particular resource.

            Parameters
            ----------
            resource_id : {int}
                unique identifier of resource for which image is being uploaded.

            image : {file}
                file object corresponding to image being uploaded.

            image_type : {str}
                type of image being uploaded. defaults to resource.
                available options: resource, accessory
        """
        if not self.valid_resource(resource_id):
            self.error_logs.append("Invalid resource passed for image upload.")
            return False, self.error_logs
        elif image is None:
            self.error_logs.append("Empty image passed to upload utility.")
            return False, self.error_logs

        # generate unique name for image
        orig_flnm, new_flnm = \
            self.generate_name(resource_id, image.filename, image_type)

        # save image
        try:
            flpath = os.path.join(self.image_dir, new_flnm)

            image.save(flpath)

            save_success = True

        except:
            self.error_logs.append("Image upload failed.")
            return False, self.error_logs

        # add file record to database
        image_addition_query = \
        """
            INSERT INTO image (image_type, generated_filename, original_filename)
            VALUES ('{type}', '{flnm}', '{orig}')
            RETURNING id;
        """.format(type=image_type, flnm=new_flnm, orig=flnm)

        image_id = self.crs.fetch_first(image_addition_query)

        # add resource image mapping
        resource_image_map_query = \
        """
            INSERT INTO resource_image (resource_id, image_id)
            VALUES ({rid}, {iid})
        """.format(rid=resource_id, iid=image_id)

        return True, self.error_logs

    def upload_file(self, resource_id, file, file_type):
        """
            Main method to upload a file for a particular resource.
            Support for futher file metadata will be added in the future.

            Parameters
            ----------
            resource_id : {rid}
                unique identifier of resource for which file is being uploaded.

            file : {file}
                file object being uploaded.

            file_type : {str}
                type of file being uploaded. this is left arbitrary and is not
                constrained to particular values.
        """
        if not self.valid_resource(resource_id):
            self.error_logs.append("Invalid resource passed for file upload.")
            return False, self.error_logs
        elif file is None:
            self.error_logs.append("Empty file passed to upload utility.")
            return False, self.error_logs

        # generate unique name for file
        orig_flnm, new_flnm = \
            self.generate_name(resource_id, file.filename, image_typez)

        # save file
        try:
            flpath = os.path.join(self.file_dir, new_flnm)

            file.save(flpath)

            save_success = True

        except:
            self.error_logs.append("File upload failed.")
            return False, self.error_logs

        # add file record to database
        file_addition_query = \
        """
            INSERT INTO file (file_type, generated_filename, original_filename)
            VALUES ('{type}', '{flnm}', '{orig}')
            RETURNING id;
        """.format(type=file_type, flnm=new_flnm, orig=flnm)

        file_id = self.crs.fetch_first(file_addition_query)

        # add resource file mapping
        resource_image_map_query = \
        """
            INSERT INTO resource_file (resource_id, file_id)
            VALUES ({rid}, {fid})
        """.format(rid=resource_id, fid=file_id)

        return True, self.error_logs

    def get_uploaded_files(self, resource_id):
        """
            Main method to get a data package containing information about
            image and file uploads for a particular resource.

            Parameters
            ----------
            resource_id : {int}
                unique identifier of resource for which information is to be
                retrieved
        """
        # assume valid resource id is passed

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
                fl.file_type as type, fl.generated_filename as filename,
                fl.original_filename
            FROM file fl
            INNER JOIN resource_image ri
                ON fl.id = ri.file_id
                AND ri.resource_id = {rid}
        """.format(rid=resource_id)

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
