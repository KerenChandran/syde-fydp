-- request and notification related tables

-- primary request table
CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    requester_id SERIAL REFERENCES platform_user (id),
    resource_id SERIAL REFERENCES resource (id),
    source_account TEXT,
    target_account TEXT
);

-- primary notification table
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    message TEXT,
    read_flag BOOLEAN
);

-- relationship/mapping tables
CREATE TABLE request_schedule_blocks (
    block_id SERIAL PRIMARY KEY,
    request_id SERIAL REFERENCES request (id),
    block_start timestamp,
    block_end timestamp
);

CREATE TABLE request_incentive (
    request_id SERIAL REFERENCES request (id),
    incentive_id SERIAL REFERENCES incentive (id)
);

CREATE TABLE notification_request (
    notification_id SERIAL REFERENCES notification (id),
    request_id SERIAL REFERENCES request (id)
);

CREATE TABLE user_notification (
    user_id SERIAL REFERENCES platform_user (id),
    notification_id SERIAL REFERENCES notification (id)
);
