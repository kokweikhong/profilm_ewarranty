-- name: GetUserByID :one
SELECT
    *
FROM users
WHERE id = $1;

-- name: GetUserByUsername :one
SELECT
    *
FROM users
WHERE username = $1;

-- name: CreateUser :one
INSERT INTO users (
    shop_id,
    username,
    role,
    password_hash
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;

-- name: UpdateUserPassword :one
UPDATE users
SET
    password_hash = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: ListUsers :many
SELECT
    u.*,
    s.shop_name AS shop_name
FROM users u
LEFT JOIN shops s ON u.shop_id = s.id
ORDER BY u.id ASC;

-- name: ResetUserPassword :one
UPDATE users
SET
    password_hash = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;