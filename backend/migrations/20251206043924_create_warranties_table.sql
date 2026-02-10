-- +goose Up
-- +goose StatementBegin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'warranty_approval_status') THEN
        CREATE TYPE warranty_approval_status AS ENUM (
            'PENDING',
            'APPROVED',
            'REJECTED'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS warranties (
    id SERIAL PRIMARY KEY,
    shop_id INT NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_contact VARCHAR(50) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    car_brand VARCHAR(100) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    car_colour VARCHAR(50) NOT NULL,
    car_plate_no VARCHAR(20) NOT NULL,
    car_chassis_no VARCHAR(50) NOT NULL,
    installation_date DATE NOT NULL,
    reference_no VARCHAR(100),
    warranty_no VARCHAR(100) UNIQUE NOT NULL,
    invoice_attachment_url TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    approval_status warranty_approval_status NOT NULL DEFAULT 'PENDING',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type_enum') THEN
        CREATE TYPE product_type_enum AS ENUM (
            'Window Tinting Film',
            'Paint Protection Film'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS car_parts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    product_type product_type_enum NOT NULL,
    location_type VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS warranty_parts (
    id SERIAL PRIMARY KEY,
    warranty_id INT NOT NULL,
    product_allocation_id INT NOT NULL,
    car_part_id INT NOT NULL,
    installation_image_url VARCHAR(255) NOT NULL,
    approval_status warranty_approval_status NOT NULL DEFAULT 'PENDING',
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warranty_id) REFERENCES warranties(id),
    FOREIGN KEY (product_allocation_id) REFERENCES product_allocations(id),
    FOREIGN KEY (car_part_id) REFERENCES car_parts(id)
);

CREATE INDEX idx_warranties_car_plate_no ON warranties(car_plate_no);
CREATE INDEX idx_warranty_parts_warranty_id ON warranty_parts(warranty_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS warranty_parts CASCADE;
DROP TABLE IF EXISTS warranties CASCADE;
DROP TABLE IF EXISTS car_parts CASCADE;
DROP TYPE IF EXISTS warranty_approval_status CASCADE;
DROP TYPE IF EXISTS product_type_enum CASCADE;
-- +goose StatementEnd
