-- account information stored for platform use (inflow, outflow)
CREATE TABLE user_account (
    user_id SERIAL REFERENCES platform_user (id),
    account_id TEXT,
    account_use VARCHAR(25) -- inflow or outflow
);

-- two records are created for every transaction
-- 1: 25% of the calculated fee is transferred upfront from the source to target
-- 2: 75% of the calculated fee is left as pending to be picked up by a CRON
-- job 
CREATE TABLE transactions (
    trxn_id SERIAL PRIMARY KEY,
    source_account TEXT,
    target_account TEXT,
    amount NUMERIC,
    pending BOOLEAN,
    ts timestamp -- execution date (corresponds to end date for 75% trxns)
);
