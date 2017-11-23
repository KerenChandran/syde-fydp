# Script to create elasticsearch index and mappings

indexUrl='http://localhost:9200/equipment'

# delete equipment index if it present
curl -XDELETE $indexUrl

# create equipment index and specify mappings using helper script
bash xput_helper.sh $indexUrl mappings.json

# test resource creation
bash create_document.sh $indexUrl resource test_doc.json
