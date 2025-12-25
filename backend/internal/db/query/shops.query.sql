-- name: ListMsiaStates :many
SELECT
    id,
    name,
    code,
    created_at,
    updated_at
FROM msia_states;

-- name: GetMsiaStateByID :one
SELECT
    *
FROM msia_states
WHERE id = $1;

-- name: GetShops :many
SELECT
    *,
    (SELECT name FROM msia_states WHERE id = s.msia_state_id) AS msia_state_name
FROM shops s
ORDER BY created_at DESC;

-- name: GetShopByID :one
SELECT
    *
FROM shops
WHERE id = $1;

-- name: CreateShop :one
INSERT INTO shops (
    company_name,
    company_registration_number,
    company_license_image_url,
    company_contact_number,
    company_email,
    company_website_url,
    shop_name,
    shop_address,
    msia_state_id,
    branch_code,
    shop_image_url,
    pic_name,
    pic_position,
    pic_contact_number,
    pic_email
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15
)
RETURNING *;

-- name: UpdateShop :one
UPDATE shops
SET
    company_name = $2,
    company_registration_number = $3,
    company_license_image_url = $4,
    company_contact_number = $5,
    company_email = $6,
    company_website_url = $7,
    shop_name = $8,
    shop_address = $9,
    msia_state_id = $10,
    branch_code = $11,
    shop_image_url = $12,
    pic_name = $13,
    pic_position = $14,
    pic_contact_number = $15,
    pic_email = $16,
    is_active = $17,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: GetMaxBranchCodeByStateCode :one
SELECT branch_code
FROM shops s
JOIN msia_states ms ON s.msia_state_id = ms.id
WHERE ms.code = $1
ORDER BY s.branch_code DESC
LIMIT 1;