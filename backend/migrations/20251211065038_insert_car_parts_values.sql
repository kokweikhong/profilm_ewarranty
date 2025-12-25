-- +goose Up
-- +goose StatementBegin
INSERT into car_parts (name, code, description) VALUES
('Front Windscreen', 'FW', 'Front Windscreen'),
('Front Right', 'FR', 'Front Right Side Window'),
('Front Left', 'FL', 'Front Left Side Window'),
('Rear Right', 'RR', 'Rear Right Side Window'),
('Rear Left', 'RL', 'Rear Left Side Window'),
('Rear Windscreen', 'RW', 'Rear Windscreen'),
('Sunroof', 'SR', 'Sunroof'),
('Front Bumper', 'FB', 'Front Bumper'),
('Rear Bumper', 'RB', 'Rear Bumper');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Car parts will be deleted when the table is dropped in the schema migration
-- No action needed here as this is just seed data
-- +goose StatementEnd
