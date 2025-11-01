-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS product_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES product_brands(id),
    name VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_type_id UUID NOT NULL REFERENCES product_types(id),
    name VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_names (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_series_id UUID NOT NULL REFERENCES product_series(id),
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warranty_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    years INTEGER UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name_id UUID NOT NULL REFERENCES product_names(id),
    product_brand_id UUID NOT NULL REFERENCES product_brands(id),
    warranty_years INTEGER NOT NULL,
    film_serial_no VARCHAR(255) UNIQUE NOT NULL,
    film_quantity INTEGER NOT NULL,
    film_shipment_no VARCHAR(255) NOT NULL DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_product_name_id ON products(product_name_id);
CREATE INDEX idx_products_product_brand_id ON products(product_brand_id);
CREATE INDEX idx_products_film_serial_no ON products(film_serial_no);

-- create view for detailed product info
CREATE OR REPLACE VIEW vw_product_details AS
SELECT
    p.id AS product_id,
    pn.name AS product_name,
    ps.name AS product_series,
    pt.name AS product_type,
    pb.name AS product_brand,
    p.warranty_years,
    p.film_serial_no,
    p.film_quantity,
    p.film_shipment_no,
    p.created_at,
    p.updated_at
FROM products p
JOIN product_names pn ON p.product_name_id = pn.id
JOIN product_series ps ON pn.product_series_id = ps.id
JOIN product_types pt ON ps.product_type_id = pt.id
JOIN product_brands pb ON p.product_brand_id = pb.id;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Drop in reverse order of dependencies (child tables first)
DROP VIEW IF EXISTS product_details;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS warranty_years CASCADE;
DROP TABLE IF EXISTS product_names CASCADE;
DROP TABLE IF EXISTS product_series CASCADE;
DROP TABLE IF EXISTS product_types CASCADE;
DROP TABLE IF EXISTS product_brands CASCADE;
DROP VIEW IF EXISTS vw_product_details;
-- +goose StatementEnd
