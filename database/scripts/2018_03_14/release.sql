-- relevant file-upload tables

-- image table
CREATE TABLE image (
    id SERIAL PRIMARY KEY,
    image_type TEXT,
    generated_filename TEXT,
    original_filename TEXT
);

-- file table
CREATE TABLE misc_file (
    id SERIAL PRIMARY KEY,
    file_type TEXT,
    generated_filename TEXT,
    original_filename TEXT
);

-- mapping tables
CREATE TABLE resource_image (
    resource_id SERIAL REFERENCES resource (id),
    image_id SERIAL REFERENCES image (id)
);

CREATE TABLE resource_misc_file (
    resource_id SERIAL REFERENCES resource (id),
    file_id SERIAL REFERENCES misc_file (id)
);

CREATE TABLE user_image (
    user_id SERIAL references platform_user (id),
    image_id SERIAL REFERENCES image (id)
);

-- intermediate availability tables
CREATE TABLE intermediate_availability_blocks (
    block_id SERIAL PRIMARY KEY,
    resource_id SERIAL REFERENCES resource(id),
    user_id SERIAL REFERENCES platform_user (id),
    block_start timestamp,
    block_end timestamp
);
