-- +goose Up
-- +goose StatementBegin
-- *Exterior Car Parts for Window Tinting Film*
-- - Front Windscreen
-- - Rear Windscreen
-- - Front Right Side Window
-- - Front Left Side Window
-- - Middle Right Side Window
-- - Middle Left Side Window
-- - Rear Right Side Window
-- - Rear Left Side Window
-- - Front Right Quarter Glass
-- - Front Left Quarter Glass
-- - Rear Right Quarter Glass
-- - Rear Left Quarter Glass
-- - Sunroof
-- - Moonroof
-- - ⁠Panoramic Roof
-- *Exterior Car Parts for Paint Protection Film*
-- - Grille
-- - Bonnet
-- - Boot
-- - Roof
-- - Oil Cap
-- - Front Emblem
-- - Rear Emblem
-- - Front Bumper
-- - Rear Bumper
-- - Right Rocker Panel
-- - Left Rocker Panel
-- - Front Right Fender
-- - Front Left Fender
-- - Rear Right Fender
-- - Rear Left Fender
-- - Front Right Door Panel
-- - Front Left Door Panel
-- - Rear Right Door Panel
-- - Rear Left Door Panel
-- - Front Right Door Handle
-- - Front Left Door Handle
-- - Rear Right Door Handle
-- - Rear Left Door Handle
-- - Front Right Side Step
-- - Front Left Side Step
-- - Rear Right Side Step
-- - Rear Left Side Step
-- - Right A-Pillar
-- - Left A-Pillar
-- - Right B-Pillar
INSERT into car_parts (name, code, product_type,location_type, description) VALUES
('Front Windscreen', 'FW001', 'Window Tinting Film','Exterior','Front Windscreen for Window Tinting Film'),
('Rear Windscreen', 'RW001', 'Window Tinting Film','Exterior','Rear Windscreen for Window Tinting Film'),
('Front Right Side Window', 'FRSW001', 'Window Tinting Film','Exterior','Front Right Side Window for Window Tinting Film'),
('Front Left Side Window', 'FLSW001', 'Window Tinting Film','Exterior','Front Left Side Window for Window Tinting Film'),
('Middle Right Side Window', 'MRSW001', 'Window Tinting Film','Exterior','Middle Right Side Window for Window Tinting Film'),
('Middle Left Side Window', 'MLSW001', 'Window Tinting Film','Exterior','Middle Left Side Window for Window Tinting Film'),
('Rear Right Side Window', 'RRSW001', 'Window Tinting Film','Exterior','Rear Right Side Window for Window Tinting Film'),
('Rear Left Side Window', 'RLSW001', 'Window Tinting Film','Exterior','Rear Left Side Window for Window Tinting Film'),
('Front Right Quarter Glass', 'FRQG001', 'Window Tinting Film','Exterior','Front Right Quarter Glass for Window Tinting Film'),
('Front Left Quarter Glass', 'FLQG001', 'Window Tinting Film','Exterior','Front Left Quarter Glass for Window Tinting Film'),
('Rear Right Quarter Glass', 'RRQG001', 'Window Tinting Film','Exterior','Rear Right Quarter Glass for Window Tinting Film'),
('Rear Left Quarter Glass', 'RLQG001', 'Window Tinting Film','Exterior','Rear Left Quarter Glass for Window Tinting Film'),
('Sunroof', 'SR001', 'Window Tinting Film','Exterior','Sunroof for Window Tinting Film'),
('Moonroof', 'MR001', 'Window Tinting Film','Exterior','Moonroof for Window Tinting Film'),
('Panoramic Roof', 'PR001', 'Window Tinting Film','Exterior','Panoramic Roof for Window Tinting Film'),
('Grille', 'GL001', 'Paint Protection Film','Exterior','Grille for Paint Protection Film'),
('Bonnet', 'BN001', 'Paint Protection Film','Exterior','Bonnet for Paint Protection Film'),
('Boot', 'BT001', 'Paint Protection Film','Exterior','Boot for Paint Protection Film'),
('Roof', 'RF001', 'Paint Protection Film','Exterior','Roof for Paint Protection Film'),
('Oil Cap', 'OC001', 'Paint Protection Film','Exterior','Oil Cap for Paint Protection Film'),
('Front Emblem', 'FE001', 'Paint Protection Film','Exterior','Front Emblem for Paint Protection Film'),
('Rear Emblem', 'RE001', 'Paint Protection Film','Exterior','Rear Emblem for Paint Protection Film'),
('Front Bumper', 'FB001', 'Paint Protection Film','Exterior','Front Bumper for Paint Protection Film'),
('Rear Bumper', 'RB001', 'Paint Protection Film','Exterior','Rear Bumper for Paint Protection Film'),
('Right Rocker Panel', 'RRP001', 'Paint Protection Film','Exterior','Right Rocker Panel for Paint Protection Film'),
('Left Rocker Panel', 'LRP001', 'Paint Protection Film','Exterior','Left Rocker Panel for Paint Protection Film'),
('Front Right Fender', 'FRF001', 'Paint Protection Film','Exterior','Front Right Fender for Paint Protection Film'),
('Front Left Fender', 'FLF001', 'Paint Protection Film','Exterior','Front Left Fender for Paint Protection Film'),
('Rear Right Fender', 'RRF001', 'Paint Protection Film','Exterior','Rear Right Fender for Paint Protection Film'),
('Rear Left Fender', 'RLF001', 'Paint Protection Film','Exterior','Rear Left Fender for Paint Protection Film'),
('Front Right Door Panel', 'FRDP001', 'Paint Protection Film','Exterior','Front Right Door Panel for Paint Protection Film'),
('Front Left Door Panel', 'FLDP001', 'Paint Protection Film','Exterior','Front Left Door Panel for Paint Protection Film'),
('Rear Right Door Panel', 'RRDP001', 'Paint Protection Film','Exterior','Rear Right Door Panel for Paint Protection Film'),
('Rear Left Door Panel', 'RLDP001', 'Paint Protection Film','Exterior','Rear Left Door Panel for Paint Protection Film'),
('Front Right Door Handle', 'FRDH001', 'Paint Protection Film','Exterior','Front Right Door Handle for Paint Protection Film'),
('Front Left Door Handle', 'FLDH001', 'Paint Protection Film','Exterior','Front Left Door Handle for Paint Protection Film'),
('Rear Right Door Handle', 'RRDH001', 'Paint Protection Film','Exterior','Rear Right Door Handle for Paint Protection Film'),
('Rear Left Door Handle', 'RLDH001', 'Paint Protection Film','Exterior','Rear Left Door Handle for Paint Protection Film'),
('Front Right Side Step', 'FRSS001', 'Paint Protection Film','Exterior','Front Right Side Step for Paint Protection Film'),
('Front Left Side Step', 'FLSS001', 'Paint Protection Film','Exterior','Front Left Side Step for Paint Protection Film'),
('Rear Right Side Step', 'RRSS001', 'Paint Protection Film','Exterior','Rear Right Side Step for Paint Protection Film'),
('Rear Left Side Step', 'RLSS001', 'Paint Protection Film','Exterior','Rear Left Side Step for Paint Protection Film'),
('Right A-Pillar', 'RAP001', 'Paint Protection Film','Exterior','Right A-Pillar for Paint Protection Film'),
('Left A-Pillar', 'LAP001', 'Paint Protection Film','Exterior','Left A-Pillar for Paint Protection Film'),
('Right B-Pillar', 'RBP001', 'Paint Protection Film','Exterior','Right B-Pillar for Paint Protection Film'),
('Left B-Pillar', 'LBP001', 'Paint Protection Film','Exterior','Left B-Pillar for Paint Protection Film');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Car parts will be deleted when the table is dropped in the schema migration
-- No action needed here as this is just seed data
-- +goose StatementEnd
