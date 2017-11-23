# start all relevant containers
# linkage is abstracted by run commands in other shell scripts
# usage: bash start.sh

# create network for containers
docker network create application-network

# start database
cd database
bash run-container.sh 

# start elasticsearch server
cd ../elasticsearch
bash run-container.sh

# start backend server
cd ../server
bash run-container.sh

# start client
cd ../client
bash run-container.sh

# KNOWN CAVEAT: container linking is not instantaneous so we enable a 1
# second delay such that server connects to db and es
echo "Time delay to allow for container linking..."
sleep 10

# exec into server container and start python application
docker exec -d server python App/src/app.py
