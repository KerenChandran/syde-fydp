# convenience script to instantiate postgres container

docker run -d --name db -e POSTGRES_PASSWORD=sydefydp -p 5432:5432 --expose 5432 --net=application-network postgres
