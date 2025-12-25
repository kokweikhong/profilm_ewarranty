-- name: ListProductAllocationsView :many
SELECT
    allocation_id,
    film_serial_number,
    product_name,
    shop_name,
    branch_code,
    film_quantity,
    allocation_date,
    created_at,
    updated_at
FROM product_allocations_view
ORDER BY allocation_date DESC;

-- name: CreateProductAllocation :one
INSERT INTO product_allocations (
    product_id,
    shop_id,
    film_quantity,
    allocation_date,
    created_at,
    updated_at
) VALUES (
    $1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;

-- name: GetProductAllocationByID :one
SELECT
    id,
    product_id,
    shop_id,
    film_quantity,
    allocation_date,
    created_at,
    updated_at
FROM product_allocations
WHERE id = $1;

-- name: UpdateProductAllocation :one
UPDATE product_allocations
SET
    product_id = $2,
    shop_id = $3,
    film_quantity = $4,
    allocation_date = $5,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: GetProductsFromProductAllocationsByShopID :many
SELECT
    pa.id AS product_allocation_id,
    p.id AS product_id,
    pb.name AS brand_name,    
    pt.name AS type_name,
    ps.name AS series_name,
    pn.name AS product_name,
    p.warranty_in_months,
    p.film_serial_number,
    p.film_quantity,
    p.shipment_number,
    p.description
FROM product_allocations pa
JOIN products p ON pa.product_id = p.id
JOIN product_names pn ON p.name_id = pn.id
JOIN product_series ps ON pn.series_id = ps.id
JOIN product_types pt ON ps.type_id = pt.id
JOIN product_brands pb ON pt.brand_id = pb.id
AND p.is_active = TRUE
WHERE pa.shop_id = $1
ORDER BY brand_name ASC;