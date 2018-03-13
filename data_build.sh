# convenience script to drop and build all relevant database tables
# usage: bash data_build.sh

# drop all tables
cd trxn_db
bash exec.sh scripts/2018_01_22/rollback.sql

cd ../database
bash exec.sh scripts/2018_03_11/rollback.sql
bash exec.sh scripts/2018_03_04/rollback.sql
bash exec.sh scripts/2018_01_28/rollback.sql
bash exec.sh scripts/2018_01_24/rollback.sql
bash exec.sh scripts/2017_11_23/rollback.sql

# build all tables
bash exec.sh scripts/2017_11_23/release.sql
bash exec.sh scripts/2018_01_24/release.sql
bash exec.sh scripts/2018_01_28/release.sql
bash exec.sh scripts/2018_03_04/release.sql
bash exec.sh scripts/2018_03_11/release.sql

cd ../trxn_db
bash exec.sh scripts/2018_01_22/release.sql
