package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
)

type ProductsService interface {
	GetProducts(ctx context.Context) ([]*products.GetProductsRow, error)
	GetProductByID(ctx context.Context, id int32) (*products.Product, error)
	CreateProduct(ctx context.Context, arg *products.CreateProductParams) (*products.Product, error)
	UpdateProduct(ctx context.Context, arg *products.UpdateProductParams) (*products.Product, error)
	ListProductBrands(ctx context.Context) ([]*products.ProductBrand, error)
	ListProductTypes(ctx context.Context) ([]*products.ProductType, error)
	ListProductSeries(ctx context.Context) ([]*products.ProductSeries, error)
	ListProductNames(ctx context.Context) ([]*products.ProductName, error)
}

type productsService struct {
	db *pgxpool.Pool
	q  *products.Queries
}

func NewProductsService(db *pgxpool.Pool) ProductsService {
	return &productsService{
		db: db,
		q:  products.New(db),
	}
}

// GetProducts retrieves a list of products from the database.
func (s *productsService) GetProducts(ctx context.Context) ([]*products.GetProductsRow, error) {
	return s.q.GetProducts(ctx)
}

// GetProductByID retrieves a product by its ID from the database.
func (s *productsService) GetProductByID(ctx context.Context, id int32) (*products.Product, error) {
	return s.q.GetProductByID(ctx, id)
}

// CreateProduct creates a new product in the database.
func (s *productsService) CreateProduct(ctx context.Context, arg *products.CreateProductParams) (*products.Product, error) {
	return s.q.CreateProduct(ctx, arg)
}

// UpdateProduct updates an existing product in the database.
func (s *productsService) UpdateProduct(ctx context.Context, arg *products.UpdateProductParams) (*products.Product, error) {
	return s.q.UpdateProduct(ctx, arg)
}

// ListProductBrands retrieves a list of product brands from the database.
func (s *productsService) ListProductBrands(ctx context.Context) ([]*products.ProductBrand, error) {
	return s.q.ListProductBrands(ctx)
}

// ListProductTypes retrieves a list of product types from the database.
func (s *productsService) ListProductTypes(ctx context.Context) ([]*products.ProductType, error) {
	return s.q.ListProductTypes(ctx)
}

// ListProductSeries retrieves a list of product series from the database.
func (s *productsService) ListProductSeries(ctx context.Context) ([]*products.ProductSeries, error) {
	return s.q.ListProductSeries(ctx)
}

// ListProductNames retrieves a list of product names from the database.
func (s *productsService) ListProductNames(ctx context.Context) ([]*products.ProductName, error) {
	return s.q.ListProductNames(ctx)
}
