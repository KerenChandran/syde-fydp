# Setup elasticsearch indices

# create and test equipment index
cd es_util

cd equipment
bash create_index.sh

# create and test lab index
cd ../lab
bash create_index.sh
