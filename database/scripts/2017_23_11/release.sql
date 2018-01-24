-- create entity and relationship tables

CREATE TABLE platform_user (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password_hash VARCHAR(100),
    phone VARCHAR(15),
    preferred VARCHAR(20),
    private BOOLEAN
);

CREATE TABLE lab (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT
);

CREATE TABLE resource (
    id SERIAL PRIMARY KEY,
    category TEXT,
    company TEXT,
    model TEXT,
    mobile BOOLEAN,
    available BOOLEAN,
    description TEXT,
    rules_restrictions TEXT
);

CREATE TABLE location (
    placeId TEXT PRIMARY KEY,
    name TEXT,
    latitude NUMERIC,
    longitude NUMERIC
);

CREATE TABLE user_fee (
    id SERIAL PRIMARY KEY,
    fee_amount NUMERIC,
    cadence VARCHAR(50)
);

CREATE TABLE incentive (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    fee_id SERIAL REFERENCES user_fee (id)
);

CREATE TABLE application (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50)
);

CREATE TABLE file (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    filename TEXT
);

CREATE TABLE account (
    id VARCHAR(50) PRIMARY KEY,
    type TEXT
);

-- relationship tables

CREATE TABLE resource_user (
    resource_id SERIAL REFERENCES resource (id),
    user_id SERIAL REFERENCES platform_user (id)
);

CREATE TABLE resource_location (
    resource_id SERIAL REFERENCES resource (id),
    location_id TEXT REFERENCES location (placeId)
);

CREATE TABLE resource_incentive (
    resource_id SERIAL REFERENCES resource (id),
    incentive_id SERIAL REFERENCES incentive (id)
);

CREATE TABLE resource_lab (
    resource_id SERIAL REFERENCES resource (id),
    lab_id SERIAL REFERENCES lab (id),
    application VARCHAR(50)
);

CREATE TABLE resource_file (
    resource_id SERIAL REFERENCES resource (id),
    file_id SERIAL REFERENCES file (id)
);

CREATE TABLE lab_user (
    lab_id SERIAL REFERENCES lab (id),
    user_id SERIAL REFERENCES platform_user (id)
);

CREATE TABLE lab_application (
    lab_id SERIAL REFERENCES lab (id),
    application_id SERIAL REFERENCES application (id)
);

CREATE TABLE user_accounts (
    user_id SERIAL REFERENCES platform_user (id),
    account_id VARCHAR(50) REFERENCES account (id)
);