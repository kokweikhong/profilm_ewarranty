-- name: ListStates :many
SELECT * FROM states
ORDER BY name ASC;

-- name: GetStateByID :one
SELECT * FROM states
WHERE id = $1;

-- name: CreateState :one
INSERT INTO states (name)
VALUES ($1)
RETURNING *;

-- name: UpdateState :one
UPDATE states
SET name = $1
WHERE id = $2
RETURNING *;

-- name: DeleteState :exec
DELETE FROM states
WHERE id = $1;

-- name: ListShops :many
SELECT * FROM shops
ORDER BY created_at DESC;

-- name: GetShopByID :one
SELECT * FROM shops
WHERE id = $1;

-- name: CreateShop :one
INSERT INTO shops (
    state_id, company_name, company_registration_no, company_license_image_url,
    company_email, company_contact, company_website, name, type, address,
    image_url, pic_name, pic_contact, pic_email, pic_position,
    login_hash_password, is_active
) VALUES (
    $1, $2, $3, $4,
    $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15,
    $16, $17
)
RETURNING *;

-- name: UpdateShop :one
UPDATE shops
SET
    state_id = $1,
    company_name = $2,
    company_registration_no = $3,
    company_license_image_url = $4,
    company_email = $5,
    company_contact = $6,
    company_website = $7,
    name = $8,
    type = $9,
    address = $10,
    image_url = $11,
    pic_name = $12,
    pic_contact = $13,
    pic_email = $14,
    pic_position = $15,
    login_hash_password = $16,
    is_active = $17
WHERE id = $18
RETURNING *;

-- name: DeleteShop :exec
DELETE FROM shops
WHERE id = $1;

-- name: ListProductAllocations :many
SELECT * FROM product_allocations
ORDER BY allocated_date DESC;

-- name: GetProductAllocationByID :one
SELECT * FROM product_allocations
WHERE id = $1;

-- name: CreateProductAllocation :one
INSERT INTO product_allocations (product_id, shop_id, film_quantity)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateProductAllocation :one
UPDATE product_allocations
SET product_id = $1, shop_id = $2, film_quantity = $3
WHERE id = $4
RETURNING *;

-- name: DeleteProductAllocation :exec
DELETE FROM product_allocations
WHERE id = $1;

-- name: ListShopDetails :many
SELECT * FROM shop_details;

-- name: GetShopDetailsByID :one
SELECT * FROM shop_details
WHERE shop_id = $1;