-- name: ListProductsView :many
SELECT
    product_id,
    brand_name,
    type_name,
    series_name,
    product_name,
    warranty_period,
    film_serial_number,
    film_quantity,
    shipment_number,
    description,
    is_active,
    created_at,
    updated_at
FROM products_view
ORDER BY created_at DESC;

-- name: GetProductByID :one
SELECT
    id,
    brand_id,
    type_id,
    series_id,
    name_id,
    warranty_in_months,
    film_serial_number,
    film_quantity,
    shipment_number,
    description,
    is_active,
    created_at,
    updated_at
FROM products
WHERE id = $1;

-- name: CreateProduct :one
INSERT INTO products (
    brand_id,
    type_id,
    series_id,
    name_id,
    warranty_in_months,
    film_serial_number,
    film_quantity,
    shipment_number,
    description,
    created_at,
    updated_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;

-- name: UpdateProduct :one
UPDATE products
SET
    brand_id = $2,
    type_id = $3,
    series_id = $4,
    name_id = $5,
    warranty_in_months = $6,
    film_serial_number = $7,
    film_quantity = $8,
    shipment_number = $9,
    description = $10,
    is_active = $11,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: ListProductBrands :many
SELECT
    id,
    name,
    description,
    created_at,
    updated_at
FROM product_brands
ORDER BY name;

-- name: ListProductTypes :many
SELECT
    id,
    brand_id,
    name,
    description,
    created_at,
    updated_at
FROM product_types
ORDER BY name;

-- name: ListProductSeries :many
SELECT
    id,
    type_id,
    name,
    description,
    created_at,
    updated_at
FROM product_series
ORDER BY name;

-- name: ListProductNames :many
SELECT
    id,
    series_id,
    name,
    description,
    created_at,
    updated_at
FROM product_names
ORDER BY name;

-- name: ListWarrantyPeriods :many
SELECT
    id,
    period_years,
    description,
    created_at,
    updated_at
FROM warranty_periods;