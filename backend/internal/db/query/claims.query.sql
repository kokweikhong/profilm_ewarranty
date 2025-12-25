-- name: ListClaims :many
SELECT
    *
FROM claims
ORDER BY created_at DESC;

-- name: GetClaimByID :one
SELECT
    *
FROM claims
WHERE id = $1;

-- name: CreateClaim :one
INSERT INTO claims (
    warranty_id,
    claim_no,
    claim_date
) VALUES (
    $1, $2, $3
)
RETURNING *;

-- name: UpdateClaim :one
UPDATE claims
SET
    warranty_id = $2,
    claim_no = $3,
    claim_date = $4,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: UpdateClaimApproval :one
UPDATE claims
SET
    is_approved = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: ListClaimWarrantyPartsByClaimID :many
SELECT
    *
FROM claim_warranty_parts
WHERE claim_id = $1
ORDER BY created_at DESC;

-- name: CreateClaimWarrantyPart :one
INSERT INTO claim_warranty_parts (
    claim_id,
    warranty_part_id,
    damaged_image_url,
    remarks,
    resolution_date,
    resolution_image_url
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING *;

-- name: UpdateClaimWarrantyPart :one
UPDATE claim_warranty_parts
SET
    warranty_part_id = $2,
    damaged_image_url = $3,
    status = $4,
    remarks = $5,
    resolution_date = $6,
    resolution_image_url = $7,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- name: UpdateClaimWarrantyPartApproval :one
UPDATE claim_warranty_parts
SET
    is_approved = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;