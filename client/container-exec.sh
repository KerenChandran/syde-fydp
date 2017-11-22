# convenience script to exec into running container terminal
# usage: bash container-exec.sh <container_name>

docker exec -it ${1} bash
