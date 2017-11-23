# script to instantiate docker network
# usage: bash docker-networking.sh

# remove network if already present
docker network rm application-network

# create network
docker network create application-network

# TESTING LINK - PING #

# run database image and connect to network
cd database
bash run-container.sh

# run elasticsearch image and connect to network
cd ../elasticsearch
bash run-container.sh

# run server image and connect to network
cd ../server
bash run-container.sh

# exec into server container and ping database
docker exec -it server ping -c 1 db

echo "SUCCESS - containers linked. Tested via ping."

# TESTING LINK - CURL ELASTICSEARCH #
echo "Time delay to allow for container linking..."

sleep 10 # required delay until networking is properly setup

docker exec -it server curl es:9200

echo "SUCCESS - containers linked. Tested via curl."

# stop and remove server and database containers
docker stop server
docker rm server

docker stop db
docker rm db

docker stop es
docker rm es
