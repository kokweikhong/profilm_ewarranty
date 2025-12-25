-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    warranty_id INT NOT NULL,
    claim_no VARCHAR(100) UNIQUE NOT NULL,
    claim_date DATE NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
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
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(id),
    FOREIGN KEY (warranty_part_id) REFERENCES warranty_parts(id)
);

CREATE INDEX idx_claims_warranty_id ON claims(warranty_id);
CREATE INDEX idx_claim_warranty_parts_claim_id ON claim_warranty_parts(claim_id);
CREATE INDEX idx_claim_warranty_parts_warranty_part_id ON claim_warranty_parts(warranty_part_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS claim_warranty_parts CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
-- +goose StatementEnd
