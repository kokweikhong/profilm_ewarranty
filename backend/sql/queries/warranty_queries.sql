-- name: ListCarParts :many
SELECT * FROM car_parts
ORDER BY created_at DESC;

-- name: GetCarPartByID :one
SELECT * FROM car_parts
WHERE id = $1;

-- name: CreateCarPart :one
INSERT INTO car_parts (part_name, description)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateCarPart :one
UPDATE car_parts
SET part_name = $1, description = $2
WHERE id = $3
RETURNING *;

-- name: DeleteCarPart :exec
DELETE FROM car_parts
WHERE id = $1;

-- name: ListWarranties :many
SELECT * FROM warranties
ORDER BY installation_date DESC;

-- name: GetWarrantyByID :one
SELECT * FROM warranties
WHERE id = $1;

-- name: CreateWarranty :one
INSERT INTO warranties (
    customer_name, customer_email, customer_contact,
    car_brand, car_model, car_color, car_plate_no, car_chassis_no,
    shop_allocations_id, car_parts_id, image_url,
    installation_date, reference_no, warranty_no
) VALUES (
    $1, $2, $3,
    $4, $5, $6, $7, $8,
    $9, $10, $11,
    $12, $13, $14
)
RETURNING *;

-- name: UpdateWarranty :one
UPDATE warranties
SET customer_name = $1, customer_email = $2, customer_contact = $3,
    car_brand = $4, car_model = $5, car_color = $6, car_plate_no = $7, car_chassis_no = $8,
    shop_allocations_id = $9, car_parts_id = $10, image_url = $11,
    installation_date = $12, reference_no = $13, warranty_no = $14
WHERE id = $15
RETURNING *;

-- name: DeleteWarranty :exec
DELETE FROM warranties
WHERE id = $1;

