-- name: CreateWarranty :one
INSERT INTO warranties (user_id, product_id, purchase_date, warranty_start_date, warranty_end_date, serial_number, purchase_invoice_url, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: GetWarrantyByID :one
SELECT w.*, u.email as user_email, u.username, p.name as product_name, p.model as product_model, p.brand as product_brand
FROM warranties w
JOIN users u ON w.user_id = u.id
JOIN products p ON w.product_id = p.id
WHERE w.id = $1 AND w.deleted_at IS NULL;

-- name: GetWarrantyBySerialNumber :one
SELECT w.*, u.email as user_email, u.username, p.name as product_name, p.model as product_model, p.brand as product_brand
FROM warranties w
JOIN users u ON w.user_id = u.id
JOIN products p ON w.product_id = p.id
WHERE w.serial_number = $1 AND w.deleted_at IS NULL;

-- name: ListWarrantiesByUser :many
SELECT w.*, p.name as product_name, p.model as product_model, p.brand as product_brand
FROM warranties w
JOIN products p ON w.product_id = p.id
WHERE w.user_id = $1 AND w.deleted_at IS NULL
ORDER BY w.created_at DESC
LIMIT $2 OFFSET $3;

-- name: ListWarranties :many
SELECT w.*, u.email as user_email, u.username, p.name as product_name, p.model as product_model, p.brand as product_brand
FROM warranties w
JOIN users u ON w.user_id = u.id
JOIN products p ON w.product_id = p.id
WHERE w.deleted_at IS NULL
ORDER BY w.created_at DESC
LIMIT $1 OFFSET $2;

-- name: UpdateWarrantyStatus :one
UPDATE warranties
SET 
    status = $2,
    updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: DeleteWarranty :exec
UPDATE warranties
SET deleted_at = NOW()
WHERE id = $1;