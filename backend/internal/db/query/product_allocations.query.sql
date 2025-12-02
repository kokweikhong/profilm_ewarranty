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
    $1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
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