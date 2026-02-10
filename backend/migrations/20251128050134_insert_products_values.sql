-- +goose Up
-- +goose StatementBegin
INSERT INTO product_brands (name, description) VALUES
('Profilm', 'High-quality protective films for various applications.');

-- - Window Tinting Film
-- - Paint Protection Film
INSERT INTO product_types (brand_id, name, description) VALUES
((SELECT id FROM product_brands WHERE name='Profilm'), 'Window Tinting Film', 'Films designed to reduce heat and glare from sunlight.'),
((SELECT id FROM product_brands WHERE name='Profilm'), 'Paint Protection Film', 'Clear films that protect vehicle paint from scratches and chips.');

-- Series
-- Window Tinting Film:
-- - General
-- - Value Series
-- - Skincare Series
-- - Premium Series
-- - Flagship Series
-- - Black Series
-- Paint Protection Film:
-- - General
INSERT INTO product_series (type_id, name, description) VALUES
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'General', 'Standard window tinting films for everyday use.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Value Series', 'Affordable window tinting films with essential features.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Skincare Series', 'Window tinting films with enhanced UV protection for skin health.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Premium Series', 'High-performance window tinting films with superior heat rejection.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Flagship Series', 'Top-tier window tinting films with advanced technology and features.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Black Series', 'Specialized black window tinting films for a sleek look.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film'), 'General', 'Durable paint protection films for vehicle exteriors.');

-- Name (mandatory)
-- Window Tinting Film (Value Series):
-- - ICE80
-- - ICE50
-- - ICE35
-- - ICE15
-- - ICE5
-- - LUX50
-- - LUX35
-- - LUX15
-- - LUX5
-- - Q70
-- - S76
-- Window Tinting Film (Skincare Series):
-- - UM70
-- - UM30
-- - UM18
-- Window Tinting Film (Premium Series):
-- - Y70
-- - S35
-- - S20
-- - V35
-- - V20
-- Window Tinting Film (Flagship Series):
-- - K70
-- Window Tinting Film (Black Series):
-- - Black 50
-- - Black 35
-- - Black 15

-- Paint Protection Film (General):
-- - Nitro
-- - Nitro Matte
-- - i8 Pro
-- - i9 Pro
INSERT INTO product_names (series_id, name, description) VALUES
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'ICE80', '80% visible light transmission window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'ICE50', '50% visible light transmission window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'ICE35', '35% visible light transmission window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'ICE15', '15% visible light transmission window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'ICE5', '5% visible light transmission window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'LUX50', '50% visible light transmission luxury window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'LUX35', '35% visible light transmission luxury window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'LUX15', '15% visible light transmission luxury window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'LUX5', '5% visible light transmission luxury window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'Q70', '70% visible light transmission quantum window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Value Series'), 'S76', '76% visible light transmission standard window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Skincare Series'), 'UM70', '70% visible light transmission skincare window tinting film with UV protection.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Skincare Series'), 'UM30', '30% visible light transmission skincare window tinting film with UV protection.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Skincare Series'), 'UM18', '18% visible light transmission skincare window tinting film with UV protection.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Premium Series'), 'Y70', '70% visible light transmission premium window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Premium Series'), 'S35', '35% visible light transmission premium window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Premium Series'), 'S20', '20% visible light transmission premium window tinting film.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Premium Series'), 'V35', '35% visible light transmission premium window tinting film with enhanced visibility.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Premium Series'), 'V20', '20% visible light transmission premium window tinting film with enhanced visibility.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Flagship Series'), 'K70', '70% visible light transmission flagship window tinting film with cutting-edge technology.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Black Series'), 'Black 50', '50% visible light transmission black window tinting film for a sleek appearance.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Black Series'), 'Black 35', '35% visible light transmission black window tinting film for a sleek appearance.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film' AND ps.name='Black Series'), 'Black 15', '15% visible light transmission black window tinting film for a sleek appearance.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='General'), 'Nitro', 'High-performance paint protection film with superior durability.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='General'), 'Nitro Matte', 'Matte finish paint protection film with excellent scratch resistance.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='General'), 'i8 Pro', 'Advanced paint protection film with self-healing properties.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='General'), 'i9 Pro', 'Premium paint protection film with enhanced clarity and durability.');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Delete in reverse order to respect foreign key constraints
-- First delete products (child table)
DELETE FROM products;

-- Then delete reference data (parent tables)
DELETE FROM product_names;
DELETE FROM product_series;
DELETE FROM product_types;
DELETE FROM product_brands;
-- +goose StatementEnd
