-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_approval_status') THEN
        CREATE TYPE claim_approval_status AS ENUM (
            'PENDING',
            'APPROVED',
            'REJECTED'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    warranty_id INT NOT NULL,
    claim_no VARCHAR(100) UNIQUE NOT NULL,
    claim_date DATE NOT NULL,
    approval_status claim_approval_status NOT NULL DEFAULT 'PENDING',
    status VARCHAR(50) NOT NULL DEFAULT 'Open', -- e.g., Open, Closed.
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warranty_id) REFERENCES warranties(id)
);

CREATE TABLE IF NOT EXISTS claim_warranty_parts (
    id SERIAL PRIMARY KEY,
    claim_id INT NOT NULL,
    warranty_part_id INT NOT NULL,
    damaged_image_url VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    remarks TEXT,
    resolution_date DATE,
    resolution_image_url VARCHAR(255),
    approval_status claim_approval_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id),
    FOREIGN KEY (warranty_part_id) REFERENCES warranty_parts(id)
);

CREATE INDEX idx_claims_warranty_id ON claims(warranty_id);
CREATE INDEX idx_claim_warranty_parts_claim_id ON claim_warranty_parts(claim_id);
CREATE INDEX idx_claim_warranty_parts_warranty_part_id ON claim_warranty_parts(warranty_part_id);

CREATE OR REPLACE VIEW claim_view AS
SELECT
    c.*,
    w.shop_id,
    w.client_name,
    w.client_contact,
    w.client_email,
    w.car_brand,
    w.car_model,
    w.car_colour,
    w.car_plate_no,
    w.car_chassis_no,
    w.installation_date,
    w.reference_no,
    w.warranty_no,
    w.invoice_attachment_url
FROM claims c
JOIN warranties w ON c.warranty_id = w.id;

CREATE OR REPLACE VIEW claim_warranty_parts_view AS
SELECT
    cwp.*,
    wp.installation_image_url,
    cp.name AS car_part_name,
    cp.code AS car_part_code,
    pa.id AS product_allocation_id,
    pb.name AS brand_name,
    pt.name AS type_name,
    ps.name AS series_name,
    pn.name AS product_name,
    p.film_serial_number,
    p.warranty_in_months
FROM claim_warranty_parts cwp
JOIN warranty_parts wp ON cwp.warranty_part_id = wp.id
JOIN warranties w ON wp.warranty_id = w.id
JOIN product_allocations pa ON wp.product_allocation_id = pa.id
JOIN products p ON pa.product_id = p.id
JOIN product_brands pb ON p.brand_id = pb.id
JOIN product_types pt ON p.type_id = pt.id
JOIN product_series ps ON p.series_id = ps.id
JOIN product_names pn ON p.name_id = pn.id
JOIN car_parts cp ON wp.car_part_id = cp.id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS claim_warranty_parts CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP VIEW IF EXISTS claim_view;
DROP VIEW IF EXISTS claim_warranty_parts_view;
DROP TYPE IF EXISTS claim_approval_status;
-- +goose StatementEnd
