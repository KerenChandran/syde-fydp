# stop all relevant containers
# usage: bash stop.sh

# stop containers if present
docker stop db
docker rm db

docker stop es
docker rm es

docker stop client
docker rm client

docker stop server
docker rm server

docker stop trxn_db
docker rm trxn_db

docker stop trxn_server
docker rm trxn_server

# remove network if it exists
docker network rm application-network
