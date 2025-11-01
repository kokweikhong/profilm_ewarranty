package services

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
)

// ProductService defines the interface for product business logic
type ProductService interface {
	CreateProductBrand(ctx context.Context, name string) (*products.ProductBrand, error)
	GetProductBrandByID(ctx context.Context, id uuid.UUID) (*products.ProductBrand, error)
	ListProductBrands(ctx context.Context) ([]*products.ProductBrand, error)
	UpdateProductBrand(ctx context.Context, id uuid.UUID, params *products.UpdateProductBrandParams) (*products.ProductBrand, error)
	DeleteProductBrand(ctx context.Context, id uuid.UUID) error

	CreateProductType(ctx context.Context, params *products.CreateProductTypeParams) (*products.ProductType, error)
	GetProductTypeByID(ctx context.Context, id uuid.UUID) (*products.ProductType, error)
	ListProductTypes(ctx context.Context) ([]*products.ProductType, error)
	UpdateProductType(ctx context.Context, params *products.UpdateProductTypeParams) (*products.ProductType, error)
	DeleteProductType(ctx context.Context, id uuid.UUID) error

	CreateProductSeries(ctx context.Context, params *products.CreateProductSeriesParams) (*products.ProductSeries, error)
	GetProductSeriesByID(ctx context.Context, id uuid.UUID) (*products.ProductSeries, error)
	ListProductSeries(ctx context.Context) ([]*products.ProductSeries, error)
	ListProductSeriesByType(ctx context.Context, productTypeID uuid.UUID) ([]*products.ProductSeries, error)
	UpdateProductSeries(ctx context.Context, params *products.UpdateProductSeriesParams) (*products.ProductSeries, error)
	DeleteProductSeries(ctx context.Context, id uuid.UUID) error

	CreateProductName(ctx context.Context, params *products.CreateProductNameParams) (*products.ProductName, error)
	GetProductNameByID(ctx context.Context, id uuid.UUID) (*products.ProductName, error)
	ListProductNames(ctx context.Context) ([]*products.ProductName, error)
	ListProductNamesBySeries(ctx context.Context, productSeriesID uuid.UUID) ([]*products.ProductName, error)
	UpdateProductName(ctx context.Context, params *products.UpdateProductNameParams) (*products.ProductName, error)
	DeleteProductName(ctx context.Context, id uuid.UUID) error

	CreateWarrantyYear(ctx context.Context, years int32) (*products.WarrantyYear, error)
	GetWarrantyYearByID(ctx context.Context, id uuid.UUID) (*products.WarrantyYear, error)
	ListWarrantyYears(ctx context.Context) ([]*products.WarrantyYear, error)
	UpdateWarrantyYear(ctx context.Context, params *products.UpdateWarrantyYearParams) (*products.WarrantyYear, error)
	DeleteWarrantyYear(ctx context.Context, id uuid.UUID) error

	CreateProduct(ctx context.Context, params *products.CreateProductParams) (*products.Product, error)
	GetProductByID(ctx context.Context, id uuid.UUID) (*products.Product, error)
	ListProducts(ctx context.Context) ([]*products.Product, error)
	UpdateProduct(ctx context.Context, id uuid.UUID, params *products.UpdateProductParams) (*products.Product, error)
	DeleteProduct(ctx context.Context, id uuid.UUID) error

	ListProductsWithDetails(ctx context.Context) ([]*products.VwProductDetail, error)
	GetProductDetailsByID(ctx context.Context, id uuid.UUID) (*products.VwProductDetail, error)
}

// productService implements ProductService
type productService struct {
	db *pgxpool.Pool
	queries *products.Queries
}

// NewProductService creates a new product service
func NewProductService(db *pgxpool.Pool, queries *products.Queries) ProductService {
	return &productService{
		db: db,
		queries: queries,
	}
}

		
// CreateProduct creates a new product
func (r *productService) CreateProduct(ctx context.Context, params *products.CreateProductParams) (*products.Product, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)
	qtx := r.queries.WithTx(tx)
	product, err := qtx.CreateProduct(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create product: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return product, nil
}

// GetProductByID retrieves a product by ID
func (r *productService) GetProductByID(ctx context.Context, id uuid.UUID) (*products.Product, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)
	qtx := r.queries.WithTx(tx)
	product, err := qtx.GetProductByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product by ID: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return product, nil
}

// ListProducts retrieves products with pagination
func (r *productService) ListProducts(ctx context.Context) ([]*products.Product, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	products, err := qtx.ListProducts(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list products: %w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return products, nil
}

// UpdateProduct updates a product
func (r *productService) UpdateProduct(ctx context.Context, id uuid.UUID, params *products.UpdateProductParams) (*products.Product, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	product, err := qtx.UpdateProduct(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to update product: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return product, nil
}

// DeleteProduct soft deletes a product
func (r *productService) DeleteProduct(ctx context.Context, id uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	if err := qtx.DeleteProduct(ctx, id); err != nil {
		return fmt.Errorf("failed to delete product: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

// CreateProductBrand creates a new product brand
func (r *productService) CreateProductBrand(ctx context.Context, name string) (*products.ProductBrand, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productBrand, err := qtx.CreateProductBrand(ctx, name)
	if err != nil {
		return nil, fmt.Errorf("failed to create product brand: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productBrand, nil
}

// GetProductBrandByID retrieves a product brand by ID
func (r *productService) GetProductBrandByID(ctx context.Context, id uuid.UUID) (*products.ProductBrand, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productBrand, err := qtx.GetProductBrandByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product brand by ID: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productBrand, nil
}

// ListProductBrands retrieves product brands with pagination
func (r *productService) ListProductBrands(ctx context.Context) ([]*products.ProductBrand, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productBrands, err := qtx.ListProductBrands(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list product brands: %w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return productBrands, nil
}



// UpdateProductBrand updates a product brand
func (r *productService) UpdateProductBrand(ctx context.Context, id uuid.UUID, params *products.UpdateProductBrandParams) (*products.ProductBrand, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productBrand, err := qtx.UpdateProductBrand(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to update product brand: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productBrand, nil
}

// DeleteProductBrand soft deletes a product brand
func (r *productService) DeleteProductBrand(ctx context.Context, id uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	if err := qtx.DeleteProductBrand(ctx, id); err != nil {
		return fmt.Errorf("failed to delete product brand: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

// CreateProductType creates a new product type
func (r *productService) CreateProductType(ctx context.Context, params *products.CreateProductTypeParams) (*products.ProductType, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productType, err := qtx.CreateProductType(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create product type: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productType, nil
}

// GetProductTypeByID retrieves a product type by ID
func (r *productService) GetProductTypeByID(ctx context.Context, id uuid.UUID) (*products.ProductType, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productType, err := qtx.GetProductTypeByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product type by ID: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productType, nil
}

// ListProductTypes retrieves product types with pagination
func (r *productService) ListProductTypes(ctx context.Context) ([]*products.ProductType, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productTypes, err := qtx.ListProductTypes(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list product types: %w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return productTypes, nil
}


// UpdateProductType updates a product type
func (r *productService) UpdateProductType(ctx context.Context, params *products.UpdateProductTypeParams) (*products.ProductType, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productType, err := qtx.UpdateProductType(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to update product type: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productType, nil
}

// DeleteProductType soft deletes a product type
func (r *productService) DeleteProductType(ctx context.Context, id uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	if err := qtx.DeleteProductType(ctx, id); err != nil {
		return fmt.Errorf("failed to delete product type: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

// CreateProductSeries creates a new product series
func (r *productService) CreateProductSeries(ctx context.Context, params *products.CreateProductSeriesParams) (*products.ProductSeries, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productSeries, err := qtx.CreateProductSeries(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create product series: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productSeries, nil
}

// GetProductSeriesByID retrieves a product series by ID
func (r *productService) GetProductSeriesByID(ctx context.Context, id uuid.UUID) (*products.ProductSeries, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productSeries, err := qtx.GetProductSeriesByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product series by ID: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productSeries, nil
}

// ListProductSeries retrieves product series with pagination
func (r *productService) ListProductSeries(ctx context.Context) ([]*products.ProductSeries, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productSeries, err := qtx.ListProductSeries(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list product series: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productSeries, nil
}

// ListProductSeriesByType retrieves product series by product type ID
func (r *productService) ListProductSeriesByType(ctx context.Context, productTypeID uuid.UUID) ([]*products.ProductSeries, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productSeries, err := qtx.ListProductSeriesByType(ctx, productTypeID)
	if err != nil {
		return nil, fmt.Errorf("failed to list product series by type: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productSeries, nil
}


// UpdateProductSeries updates a product series
func (r *productService) UpdateProductSeries(ctx context.Context, params *products.UpdateProductSeriesParams) (*products.ProductSeries, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productSeries, err := qtx.UpdateProductSeries(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to update product series: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productSeries, nil
}

// DeleteProductSeries soft deletes a product series
func (r *productService) DeleteProductSeries(ctx context.Context, id uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	if err := qtx.DeleteProductSeries(ctx, id); err != nil {
		return fmt.Errorf("failed to delete product series: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

// CreateProductName creates a new product name
func (r *productService) CreateProductName(ctx context.Context, params *products.CreateProductNameParams) (*products.ProductName, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productName, err := qtx.CreateProductName(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create product name: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productName, nil
}

// GetProductNameByID retrieves a product name by ID
func (r *productService) GetProductNameByID(ctx context.Context, id uuid.UUID) (*products.ProductName, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productName, err := qtx.GetProductNameByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product name by ID: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productName, nil
}

// ListProductNames retrieves product names with pagination
func (r *productService) ListProductNames(ctx context.Context) ([]*products.ProductName, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productNames, err := qtx.ListProductNames(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list product names: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productNames, nil
}

// ListProductNamesBySeries retrieves product names by product series ID
func (r *productService) ListProductNamesBySeries(ctx context.Context, productSeriesID uuid.UUID) ([]*products.ProductName, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productNames, err := qtx.ListProductNamesBySeries(ctx, productSeriesID)
	if err != nil {
		return nil, fmt.Errorf("failed to list product names by series: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productNames, nil
}

// UpdateProductType updates a product type
func (r *productService) UpdateProductName(ctx context.Context, params *products.UpdateProductNameParams) (*products.ProductName, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productName, err := qtx.UpdateProductName(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to update product name: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productName, nil
}

// DeleteProductName soft deletes a product name
func (r *productService) DeleteProductName(ctx context.Context, id uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	if err := qtx.DeleteProductName(ctx, id); err != nil {
		return fmt.Errorf("failed to delete product name: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

// CreateWarrantyYear creates a new warranty year
func (r *productService) CreateWarrantyYear(ctx context.Context, years int32) (*products.WarrantyYear, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	warrantyYear, err := qtx.CreateWarrantyYear(ctx, years)
	if err != nil {
		return nil, fmt.Errorf("failed to create warranty year: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return warrantyYear, nil
}


// GetWarrantyYearByID retrieves a warranty year by ID
func (r *productService) GetWarrantyYearByID(ctx context.Context, id uuid.UUID) (*products.WarrantyYear, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	warrantyYear, err := qtx.GetWarrantyYearByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get warranty year by ID: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return warrantyYear, nil
}

// ListWarrantyYears retrieves warranty years with pagination
func (r *productService) ListWarrantyYears(ctx context.Context) ([]*products.WarrantyYear, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	warrantyYears, err := qtx.ListWarrantyYears(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list warranty years: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return warrantyYears, nil
}

// UpdateWarrantyYear updates a warranty year
func (r *productService) UpdateWarrantyYear(ctx context.Context, params *products.UpdateWarrantyYearParams) (*products.WarrantyYear, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	warrantyYear, err := qtx.UpdateWarrantyYear(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to update warranty year: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return warrantyYear, nil
}

// DeleteWarrantyYear soft deletes a warranty year
func (r *productService) DeleteWarrantyYear(ctx context.Context, id uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	if err := qtx.DeleteWarrantyYear(ctx, id); err != nil {
		return fmt.Errorf("failed to delete warranty year: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}

// ListProductsWithDetails retrieves products with detailed information
func (r *productService) ListProductsWithDetails(ctx context.Context) ([]*products.VwProductDetail, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productDetails, err := qtx.ListProductsWithDetails(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list products with details: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productDetails, nil
}

// GetProductDetailByID retrieves detailed product information by ID
func (r *productService) GetProductDetailsByID(ctx context.Context, id uuid.UUID) (*products.VwProductDetail, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)
	productDetail, err := qtx.GetProductDetailsByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get product detail by ID: %w", err)
	}
	if err = tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}
	return productDetail, nil
}