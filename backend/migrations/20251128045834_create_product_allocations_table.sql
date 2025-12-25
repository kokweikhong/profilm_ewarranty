-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS product_allocations (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) NOT NULL,
    shop_id INT REFERENCES shops(id) NOT NULL,
    film_quantity INT NOT NULL,
    allocation_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS product_allocations;
-- +goose StatementEnd
