# flush out database records
cd ../../trxn_db
bash exec.sh scripts/2018_22_01/rollback.sql

# rebuild database records
bash exec.sh scripts/2018_22_01/release.sql

# instantiate trxn server
curl -X POST localhost:5001/shutdown

docker exec -d trxn_server python App/src/app.py

# start simulation
docker exec -it trxn_server python App/src/simulate_trxn.py

echo "If this script fails on retries then run the script again (sometimes the server does not shut down fast enough for it to be reinstantiated)."
