-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE VIEW product_allocations_view AS
SELECT
    pa.id AS allocation_id,
    p.film_serial_number,
    p.warranty_in_months,
    pb.name AS product_brand,
    pt.name AS product_type,
    ps.name AS product_series,
    pn.name AS product_name,
    s.shop_name,
    s.branch_code,
    pa.film_quantity,
    pa.allocation_date,
    pa.created_at,
    pa.updated_at
FROM product_allocations pa
JOIN products p ON pa.product_id = p.id
JOIN product_names pn ON p.name_id = pn.id
JOIN product_series ps ON pn.series_id = ps.id
JOIN product_types pt ON ps.type_id = pt.id
JOIN product_brands pb ON pt.brand_id = pb.id
JOIN shops s ON pa.shop_id = s.id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP VIEW IF EXISTS product_allocations_view;
-- +goose StatementEnd
