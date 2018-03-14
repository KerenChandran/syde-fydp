-- relevant file-upload tables

-- image table
CREATE TABLE image (
    id SERIAL PRIMARY KEY,
    image_type TEXT,
    generated_filename TEXT,
    original_filename TEXT
);

-- file table
CREATE TABLE file (
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

CREATE TABLE resource_file (
    resource_id SERIAL REFERENCES resource (id),
    file_id SERIAL REFERENCES file (id)
);
