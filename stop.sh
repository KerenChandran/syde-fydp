# stop all relevant containers
# usage: bash stop.sh

# stop containers if present
docker stop db
docker rm db

docker stop client
docker rm client

docker stop server
docker rm server

# remove network if it exists
docker network rm application-network
