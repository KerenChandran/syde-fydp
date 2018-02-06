-- scheduling information for each resource

-- define the upper and lower bound availability dates for a particular resource
-- used for initial filtering
CREATE TABLE resource_availability (
    resource_id SERIAL REFERENCES resource (id),
    availability_start date,
    availability_end date
);

-- individual blocks for which the resource has been scheduled
CREATE TABLE resource_schedule_blocks (
    block_id SERIAL PRIMARY KEY,
    resource_id SERIAL REFERENCES resource (id),
    user_id SERIAL REFERENCES platform_user (id),
    block_start timestamp,
    block_end timestamp
);
