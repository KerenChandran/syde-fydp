# start all relevant containers
# linkage is abstracted by run commands in other shell scripts
# usage: bash start.sh

# stop containers if present
docker stop db
docker rm db

docker stop client
docker rm client

docker stop server
docker rm server

# start database
cd database
bash run-container.sh 

# start backend server
cd ../server
bash run-container.sh

# start client
cd ../client
bash run-container.sh

# KNOWN CAVEAT: container linking is not instantaneous so we enable a 1
# second delay such that server and db are linked fully
sleep 1

# exec into server container and start python application
docker exec -d server python App/src/app.py
