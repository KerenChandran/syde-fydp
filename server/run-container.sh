# convenience script to instantiate server container

docker run -d -it -p 5000:5000 --name server -v $PWD:/App --net=application-network server-image
