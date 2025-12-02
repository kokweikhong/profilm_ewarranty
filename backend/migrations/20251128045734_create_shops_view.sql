-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE VIEW shops_view AS
SELECT
    s.id AS shop_id,
    s.company_name,
    s.company_registration_number,
    s.company_contact_number,
    s.company_email,
    s.company_website_url,
    s.shop_name,
    s.shop_address,
    ms.name AS msia_state_name,
    s.branch_code,
    s.shop_image_url,
    s.pic_name,
    s.pic_position,
    s.pic_contact_number,
    s.pic_email,
    s.login_username,
    s.is_active,
    s.created_at,
    s.updated_at
FROM shops s
LEFT JOIN msia_states ms ON s.msia_state_id = ms.id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP VIEW IF EXISTS shops_view;
-- +goose StatementEnd
