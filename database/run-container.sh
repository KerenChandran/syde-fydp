# convenience script to instantiate postgres container

docker run -d --name db -e POSTGRES_PASSWORD=sydefydp --expose 5432 --net=application-network -v $PWD:/db postgres
