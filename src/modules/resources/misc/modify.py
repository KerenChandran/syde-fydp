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
    "ownerId": [1,2,3,4,5]
}

# iterative population
iter_arr = ['id']

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
        res["id"] = idx+1

    # output to data_modified.json
    data = {
        "resources": store
    }

    with open("../data_modified.json", "w") as fl:
        json.dump(data, fl)
