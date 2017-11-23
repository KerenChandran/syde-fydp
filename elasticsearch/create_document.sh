# Helper script to create document in elasticsearch index via json file
# usage: bash create_document.sh <index_url> <document_type> <json_file_path>

json_content=$(cat $3)

curl -XPOST "${1}/${2}" -H 'Content-Type: application/json' -d "$json_content"
