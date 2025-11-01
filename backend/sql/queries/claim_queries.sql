-- name: ListClaims :many
SELECT * FROM claims
ORDER BY claim_date DESC;

-- name: GetClaimByID :one
SELECT * FROM claims
WHERE id = $1;

-- name: CreateClaim :one
INSERT INTO claims (
    warranty_id, claim_no, status, claim_date, damaged_image_url,
    resolution_image_url, remarks
) VALUES (
    $1, $2, $3, $4, $5,
    $6, $7
)
RETURNING *;

-- name: UpdateClaim :one
UPDATE claims
SET warranty_id = $1, claim_no = $2, status = $3, claim_date = $4, damaged_image_url = $5,
    resolution_image_url = $6, remarks = $7
WHERE id = $8
RETURNING *;

-- name: DeleteClaim :exec
DELETE FROM claims
WHERE id = $1;

-- name: ListClaimDetails :many
SELECT * FROM claim_details
ORDER BY claim_date DESC;