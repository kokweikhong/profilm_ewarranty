-- name: ListWarranties :many
SELECT
    w.*,
    s.shop_name,
    s.branch_code
FROM warranties w
JOIN shops s ON w.shop_id = s.id
ORDER BY w.created_at DESC;

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
    shop_id = $2,
    client_name = $3,
    client_contact = $4,
    client_email = $5,
    car_brand = $6,
    car_model = $7,
    car_colour = $8,
    car_plate_no = $9,
    car_chassis_no = $10,
    installation_date = $11,
    reference_no = $12,
    warranty_no = $13,
    invoice_attachment_url = $14,
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

-- name: GetLatestWarrantyNoByPrefix :one
SELECT
    warranty_no
FROM warranties
WHERE warranty_no LIKE $1
ORDER BY warranty_no DESC
LIMIT 1;

-- name: GetCarParts :many
SELECT
    *
FROM car_parts
ORDER BY name ASC;

-- name: CreateWarrantyPart :one
INSERT INTO warranty_parts (
    warranty_id,
    car_part_id,
    product_allocation_id,
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
WHERE id = $1
RETURNING *;

-- name: GetWarrantiesByExactSearch :many
SELECT DISTINCT
    w.*,
    s.shop_name,
    s.branch_code
FROM warranties w
JOIN shops s ON w.shop_id = s.id
LEFT JOIN warranty_parts wp ON w.id = wp.warranty_id
WHERE LOWER(w.warranty_no) = LOWER($1)
   OR LOWER(w.car_plate_no) = LOWER($1)
ORDER BY w.created_at DESC;

-- name: GetWarrantyPartsByWarrantyID :many
SELECT
    wp.*,
    cp.name AS car_part_name,
    cp.code AS car_part_code,
    p.film_serial_number,
    p.warranty_in_months,
    pb.name AS product_brand,
    pt.name AS product_type,
    ps.name AS product_series,
    pn.name AS product_name
FROM warranty_parts wp
JOIN car_parts cp ON wp.car_part_id = cp.id
JOIN product_allocations pa ON wp.product_allocation_id = pa.id
JOIN products p ON pa.product_id = p.id
JOIN product_brands pb ON p.brand_id = pb.id
JOIN product_types pt ON p.type_id = pt.id
JOIN product_series ps ON p.series_id = ps.id
JOIN product_names pn ON p.name_id = pn.id
WHERE wp.warranty_id = $1;

-- name: GetWarrantiesByShopID :many
SELECT
    w.*,
    s.shop_name,
    s.branch_code
FROM warranties w
JOIN shops s ON w.shop_id = s.id
WHERE w.shop_id = $1
ORDER BY w.created_at DESC;

-- name: DeleteWarrantyPart :exec
DELETE FROM warranty_parts
WHERE id = $1;