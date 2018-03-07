curl -XPOST localhost:5000/shutdown

docker exec -it server python App/src/app.py
