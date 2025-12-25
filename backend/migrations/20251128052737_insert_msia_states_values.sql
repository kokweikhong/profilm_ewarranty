-- +goose Up
-- +goose StatementBegin
--   { name: "Johor", abbreviation: "JH" },
--   { name: "Kedah", abbreviation: "KD" },
--   { name: "Kelantan", abbreviation: "KN" },
--   { name: "Malacca", abbreviation: "ML" },
--   { name: "Negeri Sembilan", abbreviation: "NS" },
--   { name: "Pahang", abbreviation: "PH" },
--   { name: "Penang", abbreviation: "PG" },
--   { name: "Perak", abbreviation: "PR" },
--   { name: "Perlis", abbreviation: "PL" },
--   { name: "Sabah", abbreviation: "SB" },
--   { name: "Sarawak", abbreviation: "SW" },
--   { name: "Selangor", abbreviation: "SG" },
--   { name: "Terengganu", abbreviation: "TR" },
--   { name: "Kuala Lumpur", abbreviation: "KL" },
--   { name: "Putrajaya", abbreviation: "PJ" },
-- --   { name: "Labuan", abbreviation: "LB" },
-- CREATE TABLE IF NOT EXISTS msia_states (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     code VARCHAR(10) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
INSERT INTO msia_states (name, code) VALUES
('Johor', 'JH'),
('Kedah', 'KD'),
('Kelantan', 'KN'),
('Malacca', 'ML'),
('Negeri Sembilan', 'NS'),
('Pahang', 'PH'),
('Penang', 'PG'),
('Perak', 'PR'),
('Perlis', 'PL'),
('Sabah', 'SB'),
('Sarawak', 'SW'),
('Selangor', 'SG'),
('Terengganu', 'TR'),
('Kuala Lumpur', 'KL'),
('Putrajaya', 'PJ');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Delete in reverse dependency order
-- product_allocations references both products and shops
DELETE FROM product_allocations;

-- shops references msia_states
DELETE FROM shops;

-- Then delete states
DELETE FROM msia_states WHERE name IN (
    'Johor', 'Kedah', 'Kelantan', 'Malacca', 'Negeri Sembilan', 'Pahang',
    'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor',
    'Terengganu', 'Kuala Lumpur', 'Putrajaya'
);
-- +goose StatementEnd
