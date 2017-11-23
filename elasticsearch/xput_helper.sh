# Helper script to execute put commands against elasticsearch index with json file
# usage: bash xput_helper.sh <index_url> <json_file_path>

json_content=$(cat $2)

curl -XPUT $1 -H 'Content-Type: application/json' -d "$json_content"
