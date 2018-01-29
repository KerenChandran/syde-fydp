"""
    Test upload pipeline by simulating API endpoint.
"""
import json

from ..upload import UploadPipeline


def main():
    """
        Main method for testing upload pipeline with single and bulk resources.
    """
    up = UploadPipeline()

    parsed_mappings = up.parsed_mappings

    mapping_dict = {
        str: "test",
        float: 0.01,
        int: 10,
        bool: True
    }

    data_point = {}

    for fld in parsed_mappings:
        if "location" in fld: # ignore location
            continue
        elif fld == 'resource_id': # we're creating a new record
            continue

        data_point[fld] = mapping_dict[parsed_mappings[fld]]

    data_point['location'] = {
        'name': 'test',
        'placeId': 'test',
        'latitude': 10,
        'longitude': 10
    }

    # single resource upload
    data = [data_point]

    success, errors, resource_id = up.run(data)

    message = "SINGLE RESOURCE UPLOAD TEST"

    print "\n"
    print message
    print "-" * len(message)

    print "success: %s" % success

    print "errors: %s" % ",".join(errors)

    data = [data_point] * 10

    success, errors, resource_id = up.run(data)

    message = "BULK RESOURCE UPLOAD TEST"

    print "\n"
    print message
    print "-" * len(message)

    print "success: %s" % success

    print "errors: %s" % ",".join(errors)

    return True

if __name__ == '__main__':
    main()
