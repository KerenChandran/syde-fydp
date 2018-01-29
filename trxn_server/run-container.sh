# convenience script to instantiate server container

docker run -d -it -p 5001:5000 --name trxn_server -v $PWD:/App --env-file vars.env --net=application-network trxn-server-image
