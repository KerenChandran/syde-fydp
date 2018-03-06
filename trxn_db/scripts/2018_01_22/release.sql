-- create entity and relationship tables

-- don't store user details for now (not required for sim)
CREATE TABLE trxn_user (
    id SERIAL PRIMARY KEY
);

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    type TEXT,
    balance NUMERIC
);

-- relationship tables

CREATE TABLE user_account (
    user_id SERIAL REFERENCES trxn_user (id),
    account_id SERIAL REFERENCES account (id)
);
