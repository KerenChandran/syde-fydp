# convenience script to restart main python server
# usage: bash shutdown_restart_server.sh

curl -XPOST localhost:5000/shutdown

docker exec -it server python App/src/app.py
