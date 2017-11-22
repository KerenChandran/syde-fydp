# script to instantiate docker network
# usage: bash docker-networking.sh

# remove network if already present
docker network rm application-network

# create network
docker network create application-network

# TESTING LINK - PING#

# run server image and connect to network
cd server
bash run-container.sh

# run database image and connect to network
cd ../database
bash run-container.sh

# exec into server container and ping database
docker exec -it server ping -c 1 db

echo "SUCCESS - containers linked. Tested via ping."

# stop and remove server and database containers
docker stop server
docker rm server

docker stop db
docker rm db
