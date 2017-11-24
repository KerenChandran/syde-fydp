# Script to create equipment index and mappings

indexUrl='http://localhost:9200/equipment'

# delete indices if present
curl -XDELETE $indexUrl

# create equipment index and specify mappings using helper script
bash ../xput_helper.sh $indexUrl $PWD/mappings.json

# test resource creation for equipment
bash ../create_document.sh $indexUrl resource $PWD/test_doc.json
