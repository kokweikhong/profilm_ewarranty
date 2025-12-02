-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS product_brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_types (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES product_brands(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_series (
    id SERIAL PRIMARY KEY,
    type_id INT REFERENCES product_types(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_names (
    id SERIAL PRIMARY KEY,
    series_id INT REFERENCES product_series(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warranty_periods (
    id SERIAL PRIMARY KEY,
    period_years INT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES product_brands(id) NOT NULL,
    type_id INT REFERENCES product_types(id) NOT NULL,
    series_id INT REFERENCES product_series(id) NOT NULL,
    name_id INT REFERENCES product_names(id) NOT NULL,
    warranty_in_months INT NOT NULL,
    film_serial_number VARCHAR(255) UNIQUE NOT NULL,
    film_quantity INT NOT NULL,
    shipment_number VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_name_id ON products(name_id);
CREATE INDEX idx_products_film_serial_number ON products(film_serial_number);
CREATE INDEX idx_product_brands_name ON product_brands(name);
CREATE INDEX idx_product_types_name ON product_types(name);
CREATE INDEX idx_product_series_name ON product_series(name);
CREATE INDEX idx_product_names_name ON product_names(name);
CREATE INDEX idx_warranty_periods_period_years ON warranty_periods(period_years);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS warranty_periods;
DROP TABLE IF EXISTS product_names;
DROP TABLE IF EXISTS product_series;
DROP TABLE IF EXISTS product_types;
DROP TABLE IF EXISTS product_brands;
-- +goose StatementEnd
