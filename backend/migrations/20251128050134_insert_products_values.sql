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
-- - Value Series
-- - Skincare Series
-- - Premium Series
-- - Flagship Series
-- Paint Protection Film:
-- - Clear Series
-- - ProColor Series
-- - Flagship Series
INSERT INTO product_series (type_id, name, description) VALUES
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Value Series', 'Affordable window tinting films with essential features.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Skincare Series', 'Window tinting films with enhanced UV protection for skin health.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Premium Series', 'High-performance window tinting films with superior heat rejection.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Window Tinting Film'), 'Flagship Series', 'Top-tier window tinting films with advanced technology and features.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film'), 'Clear Series', 'Basic paint protection films for everyday use.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film'), 'ProColor Series', 'Colored paint protection films for aesthetic enhancement.'),
((SELECT pt.id FROM product_types pt JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film'), 'Flagship Series', 'Premium paint protection films with maximum durability and clarity.');

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
-- Paint Protection Film (Clear Series):
-- - Hydro ProTect
-- - P10
-- - reGen
-- - Ultra Clear Pro
-- Paint Protection Film (ProColor Series):
-- - Blue Diamond
-- - Gold Diamond
-- - Gold Shine
-- - Green Chameleon
-- - Moon Shine
-- - Red Diamond
-- - Rose Chameleon
-- - Silver Diamond
-- Paint Protection Film (Flagship Series):
-- - Ultra Clear Pro X
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
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='Clear Series'), 'Hydro ProTect', 'Hydrophobic paint protection film with self-healing properties.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='Clear Series'), 'P10', '10 mil thickness clear paint protection film for basic protection.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='Clear Series'), 'reGen', 'Self-healing paint protection film for minor scratches and swirls.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='Clear Series'), 'Ultra Clear Pro', 'High-clarity paint protection film with superior durability.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Blue Diamond', 'Blue tinted paint protection film for aesthetic enhancement.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Gold Diamond', 'Gold tinted paint protection film for a luxurious look.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Gold Shine', 'Shiny gold paint protection film for enhanced appearance.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Green Chameleon', 'Color-shifting green paint protection film for a unique look.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Moon Shine', 'Iridescent paint protection film that changes color under different lighting.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Red Diamond', 'Red tinted paint protection film for a bold appearance.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Rose Chameleon', 'Color-shifting rose paint protection film for a stylish look.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='ProColor Series'), 'Silver Diamond', 'Silver tinted paint protection film for a sleek appearance.'),
((SELECT ps.id FROM product_series ps JOIN product_types pt ON ps.type_id = pt.id JOIN product_brands pb ON pt.brand_id = pb.id WHERE pb.name='Profilm' AND pt.name='Paint Protection Film' AND ps.name='Flagship Series'), 'Ultra Clear Pro X', 'Next-generation ultra-clear paint protection film with maximum durability and clarity.'); 
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
