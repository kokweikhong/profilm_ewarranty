-- name: ListWarranties :many
SELECT
    *
FROM warranties
ORDER BY created_at DESC;

-- name: GetWarrantyByID :one
SELECT
    *
FROM warranties
WHERE id = $1;

-- name: CreateWarranty :one
INSERT INTO warranties (
    shop_id,
    client_name,
    client_contact,
    client_email,
    car_brand,
    car_model,
    car_colour,
    car_plate_no,
    car_chassis_no,
    installation_date,
    reference_no,
    warranty_no,
    invoice_attachment_url
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
)
RETURNING *;

-- name: UpdateWarranty :one
UPDATE warranties
SET
    client_name = $2,
    client_contact = $3,
    client_email = $4,
    car_brand = $5,
    car_model = $6,
    car_colour = $7,
    car_plate_no = $8,
    car_chassis_no = $9,
    installation_date = $10,
    reference_no = $11,
    invoice_attachment_url = $12,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: UpdateWarrantyApproval :one
UPDATE warranties
SET
    is_approved = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: GetWarrantyByWarrantyNo :one
SELECT
    *
FROM warranties
WHERE warranty_no = $1;

-- name: GetWarrantiesByCarPlateNo :many
SELECT
    *
FROM warranties
WHERE car_plate_no = $1
ORDER BY created_at DESC;

-- name: GetLatestWarrantyNoByPrefix :one
SELECT
    warranty_no
FROM warranties
WHERE warranty_no LIKE $1
ORDER BY warranty_no DESC
LIMIT 1;

-- name: GetWarrantiesBySearchTerm :many
SELECT
    *
FROM warranties
WHERE car_plate_no ILIKE '%' || $1 || '%'
   OR warranty_no ILIKE '%' || $1 || '%'
ORDER BY created_at DESC;

-- name: GetCarParts :many
SELECT
    *
FROM car_parts
ORDER BY name ASC;

-- name: CreateWarrantyPart :one
INSERT INTO warranty_parts (
    warranty_id,
    product_allocation_id,
    car_part_id,
    installation_image_url
) VALUES
    ( $1, $2, $3, $4 )
RETURNING *;

-- name: UpdateWarrantyPart :one
UPDATE warranty_parts
SET
    warranty_id = $2,
    car_part_id = $3,
    product_allocation_id = $4,
    installation_image_url = $5,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: UpdateWarrantyPartApproval :one
UPDATE warranty_parts
SET
    is_approved = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE warranty_id = $1 AND car_part_id = $3
RETURNING *;

-- name: GetWarrantyPartsByWarrantyID :many
SELECT
    *
FROM warranty_parts
WHERE warranty_id = $1;

-- name: GetWarrantiesByShopID :many
SELECT
    *
FROM warranties
WHERE shop_id = $1
ORDER BY created_at DESC;