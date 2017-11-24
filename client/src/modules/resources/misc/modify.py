# helper to modify data

import json
import random

# mandatory fields pulled directly from data
fields = ['Category', 'Model', 'Company', 'Fine']

# dynamic generation of pre-populated values
dynamic_map = {
    "faculty": ["Engineering", "Science", "Mathematics"],
    "location": ["Engineering 5", "Engineering 2", "M3", "DWE"],
    "incentive": "User Fees",
    "available": [False, True],
    "ownerId": [1,2,3,4,5],
    "mobile": [False, True]
}

# iterative population
iter_arr = ['id']

# owner details
owner_map = {
    1: {
        'name': 'John',
        'phone': '519 888 4567 x123',
        'email': 'john@resourcesharing.com',
        'privacy': False,
        'emailPreferred': False,
        'phonePreferred': True
    }, 2: {
        'name': 'Emily',
        'phone': '519 888 4567 x456',
        'email': 'emily@resourcesharing.com',
        'privacy': False,
        'emailPreferred': True,
        'phonePreferred': False
    }, 3: {
        'name': 'Sid',
        'phone': '647 555 1234',
        'email': 'sid@resourcesharing.com',
        'privacy': False,
        'emailPreferred': True,
        'phonePreferred': False
    }, 4: {
        'name': 'Julia',
        'phone': '416 987 4321',
        'email': 'julia@resourcesharing.com',
        'privacy': False,
        'emailPreferred': False,
        'phonePreferred': True
    }, 5: {
        'name': 'Abbey',
        'phone': '905 203 5678',
        'email': 'abbey@resourcesharing.com',
        'privacy': False,
        'emailPreferred': True,
        'phonePreferred': False
    }
}

if __name__ == '__main__':
    data = json.load(open("../data.json"))

    data = data["resources"]

    # extract fields
    store = []

    for res in data:
        empty = {}

        for fld in fields:
            empty[fld.lower()] = res[fld]

            if fld == "Fine":
                try:
                    empty["fine"] = empty["fine"].split(" ")[1].strip()
                    empty["fine"] = float(empty["fine"])
                except:
                    empty["fine"] = None

        store.append(empty)

    # dynamically add content
    for res in store:
        for fld in dynamic_map:
            if not isinstance(dynamic_map[fld], list):
                # populate directly
                res[fld] = dynamic_map[fld]

                continue
            
            # randomly generate array index
            idx = random.randint(0,len(dynamic_map[fld])-1)

            res[fld] = dynamic_map[fld][idx]

    # add index+1 as unique identifier
    for idx, res in enumerate(store):
        res["id"] = idx+1000+1

    # include owner details
    for res in store:
        res.update(owner_map[res["ownerId"]])

    # output to data_modified.json
    data = {
        "resources": store
    }

    with open("../data_modified.json", "w") as fl:
        json.dump(data, fl)
