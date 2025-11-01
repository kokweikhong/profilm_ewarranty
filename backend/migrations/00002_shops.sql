-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID NOT NULL REFERENCES states(id),
    company_name VARCHAR(255) NOT NULL,
    company_registration_no VARCHAR(100) NOT NULL,
    company_license_image_url TEXT NOT NULL DEFAULT '',
    company_email VARCHAR(255) NOT NULL,
    company_contact VARCHAR(50) NOT NULL,
    company_website VARCHAR(255) DEFAULT '',
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    pic_name VARCHAR(100) NOT NULL,
    pic_contact VARCHAR(50) NOT NULL,
    pic_email VARCHAR(255) NOT NULL,
    pic_position VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    login_hash_password VARCHAR(255) NOT NULL DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    shop_id UUID NOT NULL REFERENCES shops(id),
    film_quantity INTEGER NOT NULL DEFAULT 0,
    allocated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shops_state_id ON shops(state_id);
CREATE INDEX idx_product_allocations_product_id ON product_allocations(product_id);
CREATE INDEX idx_product_allocations_shop_id ON product_allocations(shop_id);
CREATE INDEX idx_states_name ON states(name);

CREATE OR REPLACE VIEW shop_details AS
SELECT
    s.id AS shop_id,
    s.company_name,
    s.company_registration_no,
    s.company_license_image_url,
    s.company_email,
    s.company_contact,
    s.company_website,
    s.name,
    s.type,
    s.address,
    s.image_url,
    s.pic_name,
    s.pic_contact,
    s.pic_email,
    s.pic_position,
    s.login_hash_password,
    s.is_active,
    s.created_at,
    s.updated_at,
    st.id AS state_id,
    st.name AS state_name
FROM shops s
JOIN states st ON s.state_id = st.id;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Drop in reverse order of dependencies (child tables first)
DROP TABLE IF EXISTS product_allocations CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS states CASCADE;
DROP VIEW IF EXISTS shop_details;
-- +goose StatementEnd
