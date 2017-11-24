# convenience script to exec into docker container and execute db script
# usage: bash exec.sh <path_to_script>

docker exec -it db bash -c "cd db && psql --username=postgres -w --file=$1"
