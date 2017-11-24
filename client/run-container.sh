# convenience script to run client instance

docker run -d -it -p 3000:3000 -v "$PWD":/App --name client --net=application-network client-image

docker exec -d -it client bash /App/setup.sh
