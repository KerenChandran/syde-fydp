-- create entity and relationship tables

CREATE TABLE platform_user (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone VARCHAR(15),
    faculty TEXT,
    department TEXT,
    role TEXT
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
    room_number TEXT,
    rules_restrictions TEXT
);

CREATE TABLE location (
    placeid TEXT PRIMARY KEY,
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
    -- using integer as null values can be present
    fee_id INTEGER REFERENCES user_fee (id)
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

-- relationship tables

CREATE TABLE resource_user (
    resource_id SERIAL REFERENCES resource (id),
    user_id SERIAL REFERENCES platform_user (id)
);

CREATE TABLE user_password (
    user_id SERIAL REFERENCES platform_user (id),
    password_hash VARCHAR(100)
);

CREATE TABLE resource_location (
    resource_id SERIAL REFERENCES resource (id),
    location_id TEXT REFERENCES location (placeid)
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
