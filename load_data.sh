# script to load modified data into database

# move modified json data to server directory
cp client/src/modules/resources/data.json server/src/lib/data.json

# run python server and execute load script
docker exec -it server python App/src/lib/load_data.py
