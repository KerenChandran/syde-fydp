-- availability information for each resource
CREATE TABLE resource_availability_blocks (
    block_id SERIAL PRIMARY KEY,
    resource_id SERIAL REFERENCES resource(id),
    user_id SERIAL REFERENCES platform_user (id),
    block_start timestamp,
    block_end timestamp
)
