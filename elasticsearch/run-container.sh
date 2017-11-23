# convenience script to instantiate elasticsearch container

docker run -d -it -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -v $PWD:/usr/share/elasticsearch/es_util --name es \
    --net application-network docker.elastic.co/elasticsearch/elasticsearch:6.0.0
