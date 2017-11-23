# Setup elasticsearch with mobz head interface plugin

# install git
yum install -y git

# retrieve repository
git clone https://github.com/mobz/elasticsearch-head.git

# install node+npm
yum install -y gcc-c++ make

curl -sL https://rpm.nodesource.com/setup_6.x | bash -

yum install -y nodejs

# install node dependencies 

cd elasticsearch-head

npm install

npm run start
