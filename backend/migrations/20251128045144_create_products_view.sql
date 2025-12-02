-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE VIEW products_view AS
SELECT
    p.id AS product_id,
    pb.name AS brand_name,
    pt.name AS type_name,
    ps.name AS series_name,
    pn.name AS product_name,
    p.warranty_in_months AS warranty_period,
    p.film_serial_number,
    p.film_quantity,
    p.shipment_number,
    p.description,
    p.is_active,
    p.created_at,
    p.updated_at
FROM products p
JOIN product_names pn ON p.name_id = pn.id
JOIN product_series ps ON p.series_id = ps.id
JOIN product_types pt ON p.type_id = pt.id
JOIN product_brands pb ON p.brand_id = pb.id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP VIEW IF EXISTS products_view;
-- +goose StatementEnd
