# convenience script to instantiate server container

docker run -d -it -p 5000:5000 --name server -v $PWD:/App --env-file vars.env --net=application-network server-image
