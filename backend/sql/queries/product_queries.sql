-- name: CreateProductBrand :one
INSERT INTO product_brands (name)
VALUES ($1)
RETURNING *;

-- name: GetProductBrandByID :one
SELECT * FROM product_brands
WHERE id = $1;

-- name: ListProductBrands :many
SELECT * FROM product_brands
ORDER BY name ASC;

-- name: UpdateProductBrand :one
UPDATE product_brands
SET 
    name = $1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;

-- name: DeleteProductBrand :exec
DELETE FROM product_brands
WHERE id = $1;

-- name: CreateProductType :one
INSERT INTO product_types (brand_id, name)
VALUES ($1, $2)
RETURNING *;

-- name: GetProductTypeByID :one
SELECT * FROM product_types
WHERE id = $1;

-- name: ListProductTypes :many
SELECT * FROM product_types
ORDER BY name ASC;

-- name: UpdateProductType :one
UPDATE product_types
SET 
    brand_id = $1,
    name = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING *;

-- name: DeleteProductType :exec
DELETE FROM product_types
WHERE id = $1;

-- name: CreateProductSeries :one
INSERT INTO product_series (product_type_id, name)
VALUES ($1, $2)
RETURNING *;

-- name: GetProductSeriesByID :one
SELECT * FROM product_series
WHERE id = $1;

-- name: ListProductSeries :many
SELECT * FROM product_series
ORDER BY name ASC;

-- name: ListProductSeriesByType :many
SELECT * FROM product_series
WHERE product_type_id = $1;

-- name: UpdateProductSeries :one
UPDATE product_series
SET 
    name = $1,
    product_type_id = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING *;

-- name: DeleteProductSeries :exec
DELETE FROM product_series
WHERE id = $1;

-- name: CreateProductName :one
INSERT INTO product_names (product_series_id, name)
VALUES ($1, $2)
RETURNING *;

-- name: GetProductNameByID :one
SELECT * FROM product_names
WHERE id = $1;

-- name: ListProductNames :many
SELECT * FROM product_names
ORDER BY name ASC;

-- name: ListProductNamesBySeries :many
SELECT * FROM product_names
WHERE product_series_id = $1;

-- name: UpdateProductName :one
UPDATE product_names
SET 
    name = $1,
    product_series_id = $2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING *;

-- name: DeleteProductName :exec
DELETE FROM product_names
WHERE id = $1;

-- name: CreateWarrantyYear :one
INSERT INTO warranty_years (years)
VALUES ($1)
RETURNING *;

-- name: GetWarrantyYearByID :one
SELECT * FROM warranty_years
WHERE id = $1;

-- name: ListWarrantyYears :many
SELECT * FROM warranty_years
ORDER BY years ASC;

-- name: UpdateWarrantyYear :one
UPDATE warranty_years
SET
    years = $1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;

-- name: DeleteWarrantyYear :exec
DELETE FROM warranty_years
WHERE id = $1;

-- name: CreateProduct :one
INSERT INTO products (product_name_id, product_brand_id, warranty_years, film_serial_no, film_quantity, film_shipment_no)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetProductByID :one
SELECT * FROM products
WHERE id = $1;

-- name: ListProducts :many
SELECT * FROM products
ORDER BY created_at DESC;

-- name: UpdateProduct :one
UPDATE products
SET 
    product_name_id = $1,
    product_brand_id = $2,
    warranty_years = $3,
    film_serial_no = $4,
    film_quantity = $5,
    film_shipment_no = $6,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $7
RETURNING *;

-- name: DeleteProduct :exec
DELETE FROM products
WHERE id = $1;

-- name: ListProductsWithDetails :many
SELECT * FROM vw_product_details
ORDER BY created_at DESC;

-- name: GetProductDetailsByID :one
SELECT * FROM vw_product_details
WHERE product_id = $1;
