package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/productallocations"
)

type ProductAllocationsService interface {
	ListProductAllocationsView(ctx context.Context) ([]*productallocations.ListProductAllocationsViewRow, error)
	CreateProductAllocation(ctx context.Context, arg *productallocations.CreateProductAllocationParams) (*productallocations.ProductAllocation, error)
	GetProductAllocationByID(ctx context.Context, id int32) (*productallocations.ProductAllocation, error)
	UpdateProductAllocation(ctx context.Context, arg *productallocations.UpdateProductAllocationParams) (*productallocations.ProductAllocation, error)

	GetProductsFromProductAllocationsByShopID(ctx context.Context, shopID int32) ([]*productallocations.GetProductsFromProductAllocationsByShopIDRow, error)
}

type productAllocationsService struct {
	db *pgxpool.Pool
	q  *productallocations.Queries
}

func NewProductAllocationsService(db *pgxpool.Pool) ProductAllocationsService {
	return &productAllocationsService{
		db: db,
		q:  productallocations.New(db),
	}
}

// ListProductAllocations retrieves a list of product allocations from the database.
func (s *productAllocationsService) ListProductAllocationsView(ctx context.Context) ([]*productallocations.ListProductAllocationsViewRow, error) {
	return s.q.ListProductAllocationsView(ctx)
}

// CreateProductAllocation creates a new product allocation in the database.
func (s *productAllocationsService) CreateProductAllocation(ctx context.Context, arg *productallocations.CreateProductAllocationParams) (*productallocations.ProductAllocation, error) {
	return s.q.CreateProductAllocation(ctx, arg)
}

// GetProductAllocationByID retrieves a product allocation by its ID from the database.
func (s *productAllocationsService) GetProductAllocationByID(ctx context.Context, id int32) (*productallocations.ProductAllocation, error) {
	return s.q.GetProductAllocationByID(ctx, id)
}

// UpdateProductAllocation updates an existing product allocation in the database.
func (s *productAllocationsService) UpdateProductAllocation(ctx context.Context, arg *productallocations.UpdateProductAllocationParams) (*productallocations.ProductAllocation, error) {
	return s.q.UpdateProductAllocation(ctx, arg)
}

// GetProductsFromProductAllocationsByShopID retrieves products associated with a specific shop ID from the database.
func (s *productAllocationsService) GetProductsFromProductAllocationsByShopID(ctx context.Context, shopID int32) ([]*productallocations.GetProductsFromProductAllocationsByShopIDRow, error) {
	return s.q.GetProductsFromProductAllocationsByShopID(ctx, shopID)
}
