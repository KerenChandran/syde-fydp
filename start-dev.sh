# start all relevant containers
# linkage is abstracted by run commands in other shell scripts
# different from main as we do not run server containers as daemon
# usage: bash start.sh

# create network for containers
docker network create application-network

# start database
echo "database"
cd database
bash run-container.sh

# start transaction database
echo "transaction database"
cd ../trxn_db
bash run-container.sh

# start elasticsearch server
echo "elasticsearch"
cd ../elasticsearch
bash run-container.sh

# start transaction server
echo "transaction server"
cd ../trxn_server
bash build-image.sh
bash run-container.sh

# start backend server
echo "server"
cd ../server
bash build-image.sh
bash run-container.sh

# start client
echo "client"
cd ../client
bash build-image.sh
bash run-container.sh

# KNOWN CAVEAT: container linking is not instantaneous so we enable a 1
# second delay such that server connects to db and es
echo "Time delay to allow for container linking..."
sleep 15

echo "building indices..."

# exec into es container and build indices
docker exec -it es bash es_util/setup.sh

echo "creating database tables..."
cd ../database
# relative file paths from database directory
bash exec.sh scripts/2017_23_11/release.sql
bash exec.sh scripts/2018_24_01/release.sql
bash exec.sh scripts/2018_28_01/release.sql

echo "creating transaction database tables..."
cd ../trxn_db
bash exec.sh scripts/2018_22_01/release.sql

echo "starting app server..."

# dynamically create static folder for file uploads
docker exec -d server mkdir App/src/static

# execute this command in terminal: docker exec -it server python App/src/app.py

# execute ths command in terminal: docker exec -it trxn_server python App/src/app.py
