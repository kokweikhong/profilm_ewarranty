-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS car_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL DEFAULT '',
    customer_contact VARCHAR(50) NOT NULL,
    car_brand VARCHAR(100) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    car_color VARCHAR(50) NOT NULL,
    car_plate_no VARCHAR(50) NOT NULL,
    car_chassis_no VARCHAR(100) NOT NULL,
    shop_allocations_id UUID NOT NULL REFERENCES product_allocations(id),
    car_parts_id UUID NOT NULL REFERENCES car_parts(id),
    image_url TEXT NOT NULL DEFAULT '',
    installation_date DATE NOT NULL,
    reference_no VARCHAR(100) NOT NULL DEFAULT '',
    warranty_no VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_warranties_shop_allocations_id ON warranties(shop_allocations_id);
CREATE INDEX idx_warranties_car_parts_id ON warranties(car_parts_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS warranties;
DROP TABLE IF EXISTS car_parts;
-- +goose StatementEnd
