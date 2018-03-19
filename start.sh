# start all relevant containers
# linkage is abstracted by run commands in other shell scripts
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
bash exec.sh scripts/2017_11_23/release.sql
bash exec.sh scripts/2018_01_24/release.sql
bash exec.sh scripts/2018_01_28/release.sql
bash exec.sh scripts/2018_03_04/release.sql
bash exec.sh scripts/2018_03_11/release.sql
bash exec.sh scripts/2018_03_14/release.sql

echo "creating transaction database tables..."
cd ../trxn_db
bash exec.sh scripts/2018_01_22/release.sql

echo "starting app server..."

# dynamically create static folders for image and file uploads
docker exec -d server mkdir App/src/static_image
docker exec -d server mkdir App/src/static_file


# exec into server container and start python application
docker exec -d server python App/src/app.py

echo "starting trxn server..."
docker exec -d trxn_server python App/src/app.py

sleep 1

# test all running containers

# client
# curl localhost:3000

# elasticsearch indices
curl localhost:9200/equipment?pretty
curl localhost:9200/lab?pretty

# flask server
# sometimes empty reply is expected
curl localhost:5000

# load DEN data
cd ..
bash load_data.sh

# database - local psql dependency
# psql -h localhost -U postgres -w -c "SELECT * FROM platform_user;"

# trxn server
curl localhost:5001
