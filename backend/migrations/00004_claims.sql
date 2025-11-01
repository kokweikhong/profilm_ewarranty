-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warranty_id UUID NOT NULL REFERENCES warranties(id),
    claim_no VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    claim_date DATE NOT NULL,
    damaged_image_url TEXT NOT NULL DEFAULT '',
    resolution_image_url TEXT NOT NULL DEFAULT '',
    remarks TEXT DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW claim_details AS
SELECT
    c.id AS claim_id,
    c.claim_no,
    c.status,
    c.claim_date,
    c.damaged_image_url,
    c.resolution_image_url,
    c.remarks,
    c.created_at,
    c.updated_at,
    w.customer_name,
    w.customer_email,
    w.customer_contact,
    w.car_brand,
    w.car_model,
    w.car_plate_no,
    w.car_chassis_no,
    w.image_url AS warranty_image_url,
    w.installation_date,
    w.reference_no,
    w.warranty_no,
    cp.part_name AS car_part_name,
    cp.description AS car_part_description,
    pa.film_quantity AS allocated_film_quantity,
    pa.allocated_date AS film_allocated_date,
    st.name AS shop_state,
    s.company_name AS shop_company_name,
    s.name AS shop_name,
    s.address AS shop_address
FROM claims c
JOIN warranties w ON c.warranty_id = w.id
JOIN car_parts cp ON w.car_parts_id = cp.id
JOIN product_allocations pa ON w.shop_allocations_id = pa.id
JOIN shops s ON pa.shop_id = s.id
JOIN states st ON s.state_id = st.id;

CREATE INDEX idx_claims_warranty_id ON claims(warranty_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_claims_warranty_id;
DROP TABLE IF EXISTS claims CASCADE;
DROP VIEW IF EXISTS claim_details;
-- +goose StatementEnd
