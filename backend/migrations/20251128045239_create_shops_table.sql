-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS msia_states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS shops (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_registration_number VARCHAR(100) UNIQUE NOT NULL,
    company_license_image_url TEXT NOT NULL DEFAULT '',
    company_contact_number VARCHAR(50) NOT NULL DEFAULT '',
    company_email VARCHAR(255) NOT NULL DEFAULT '',
    company_website_url VARCHAR(255) NOT NULL DEFAULT '',
    shop_name VARCHAR(255) NOT NULL,
    shop_address TEXT NOT NULL,
    msia_state_id INT REFERENCES msia_states(id),
    branch_code VARCHAR(100) NOT NULL,
    shop_image_url TEXT NOT NULL DEFAULT '',
    pic_name VARCHAR(255) NOT NULL,
    pic_position VARCHAR(255) NOT NULL,
    pic_contact_number VARCHAR(50) NOT NULL DEFAULT '',
    pic_email VARCHAR(255) NOT NULL DEFAULT '',
    login_username VARCHAR(100) UNIQUE NOT NULL,
    login_password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shops_company_registration_number ON shops(company_registration_number);
CREATE INDEX idx_shops_login_username ON shops(login_username);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS msia_states;
-- +goose StatementEnd
