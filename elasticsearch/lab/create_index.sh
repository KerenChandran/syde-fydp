# Script to create elasticsearch index and mappings

indexUrl='http://localhost:9200/lab'

# delete indices if present
curl -XDELETE $indexUrl

# create lab index and specify mappings using helper script
bash ../xput_helper.sh $indexUrl $PWD/mappings.json

# test lab creation for equipment
bash ../create_document.sh $indexUrl lab $PWD/test_doc.json
