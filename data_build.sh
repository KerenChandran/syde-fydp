# convenience script to drop and build all relevant database tables
# usage: bash data_build.sh

# drop all tables
cd trxn_db
bash exec.sh scripts/2018_22_01/rollback.sql

cd ../database
bash exec.sh scripts/2018_28_01/rollback.sql
bash exec.sh scripts/2018_24_01/rollback.sql
bash exec.sh scripts/2017_23_11/rollback.sql

# build all tables
bash exec.sh scripts/2017_23_11/release.sql
bash exec.sh scripts/2018_24_01/release.sql
bash exec.sh scripts/2018_28_01/release.sql

cd ../trxn_db
bash exec.sh scripts/2018_22_01/release.sql
