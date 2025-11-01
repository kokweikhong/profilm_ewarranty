package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
)

// ShopService defines the shop service
type ShopService interface {
	ListStates(ctx context.Context) ([]*shops.State, error)
	GetStateByID(ctx context.Context, id uuid.UUID) (*shops.State, error)
	CreateState(ctx context.Context, name string) (*shops.State, error)
	UpdateState(ctx context.Context, params *shops.UpdateStateParams) (*shops.State, error)
	DeleteState(ctx context.Context, id uuid.UUID) error

	ListShops(ctx context.Context) ([]*shops.Shop, error)
	GetShopByID(ctx context.Context, id uuid.UUID) (*shops.Shop, error)
	CreateShop(ctx context.Context, params *shops.CreateShopParams) (*shops.Shop, error)
	UpdateShop(ctx context.Context, params *shops.UpdateShopParams) (*shops.Shop, error)
	DeleteShop(ctx context.Context, id uuid.UUID) error

	ListProductAllocations(ctx context.Context) ([]*shops.ProductAllocation, error)
	GetProductAllocationByID(ctx context.Context, id uuid.UUID) (*shops.ProductAllocation, error)
	CreateProductAllocation(ctx context.Context, params *shops.CreateProductAllocationParams) (*shops.ProductAllocation, error)
	UpdateProductAllocation(ctx context.Context, params *shops.UpdateProductAllocationParams) (*shops.ProductAllocation, error)
	DeleteProductAllocation(ctx context.Context, id uuid.UUID) error

	ListShopDetails(ctx context.Context) ([]*shops.ShopDetail, error)
	GetShopDetailsByID(ctx context.Context, id uuid.UUID) (*shops.ShopDetail, error)
}

type shopService struct {
	db      *pgxpool.Pool
	queries *shops.Queries
}

// NewShopService creates a new ShopService
func NewShopService(db *pgxpool.Pool, queries *shops.Queries) ShopService {
	return &shopService{
		db:      db,
		queries: queries,
	}
}

// ListStates lists all states
func (s *shopService) ListStates(ctx context.Context) ([]*shops.State, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	states, err := qtx.ListStates(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return states, nil
}

// GetStateByID retrieves a state by its ID
func (s *shopService) GetStateByID(ctx context.Context, id uuid.UUID) (*shops.State, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	state, err := qtx.GetStateByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return state, nil
}

// CreateState creates a new state
func (s *shopService) CreateState(ctx context.Context, name string) (*shops.State, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	state, err := qtx.CreateState(ctx, name)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return state, nil
}

// UpdateState updates an existing state
func (s *shopService) UpdateState(ctx context.Context, params *shops.UpdateStateParams) (*shops.State, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	state, err := qtx.UpdateState(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return state, nil
}

// DeleteState deletes a state by its ID
func (s *shopService) DeleteState(ctx context.Context, id uuid.UUID) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	if err := qtx.DeleteState(ctx, id); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}

// ListShops lists all shops
func (s *shopService) ListShops(ctx context.Context) ([]*shops.Shop, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	shops, err := qtx.ListShops(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return shops, nil
}

// GetShopByID retrieves a shop by its ID
func (s *shopService) GetShopByID(ctx context.Context, id uuid.UUID) (*shops.Shop, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	shop, err := qtx.GetShopByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return shop, nil
}

// CreateShop creates a new shop
func (s *shopService) CreateShop(ctx context.Context, params *shops.CreateShopParams) (*shops.Shop, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	shop, err := qtx.CreateShop(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return shop, nil
}

// UpdateShop updates an existing shop
func (s *shopService) UpdateShop(ctx context.Context, params *shops.UpdateShopParams) (*shops.Shop, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	shop, err := qtx.UpdateShop(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return shop, nil
}

// DeleteShop deletes a shop by its ID
func (s *shopService) DeleteShop(ctx context.Context, id uuid.UUID) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	if err := qtx.DeleteShop(ctx, id); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}

// ListProductAllocations lists all product allocations
func (s *shopService) ListProductAllocations(ctx context.Context) ([]*shops.ProductAllocation, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	productAllocations, err := qtx.ListProductAllocations(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return productAllocations, nil
}

// GetProductAllocationByID retrieves a product allocation by its ID
func (s *shopService) GetProductAllocationByID(ctx context.Context, id uuid.UUID) (*shops.ProductAllocation, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	productAllocation, err := qtx.GetProductAllocationByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return productAllocation, nil
}

// CreateProductAllocation creates a new product allocation
func (s *shopService) CreateProductAllocation(ctx context.Context, params *shops.CreateProductAllocationParams) (*shops.ProductAllocation, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	productAllocation, err := qtx.CreateProductAllocation(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return productAllocation, nil
}

// UpdateProductAllocation updates an existing product allocation
func (s *shopService) UpdateProductAllocation(ctx context.Context, params *shops.UpdateProductAllocationParams) (*shops.ProductAllocation, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	productAllocation, err := qtx.UpdateProductAllocation(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return productAllocation, nil
}

// DeleteProductAllocation deletes a product allocation by its ID
func (s *shopService) DeleteProductAllocation(ctx context.Context, id uuid.UUID) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	if err := qtx.DeleteProductAllocation(ctx, id); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}

// ListShopDetails lists all shop details
func (s *shopService) ListShopDetails(ctx context.Context) ([]*shops.ShopDetail, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	shopDetails, err := qtx.ListShopDetails(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return shopDetails, nil
}

// GetShopDetailByID retrieves a shop detail by its ID
func (s *shopService) GetShopDetailsByID(ctx context.Context, id uuid.UUID) (*shops.ShopDetail, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	shopDetail, err := qtx.GetShopDetailsByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return shopDetail, nil
}
