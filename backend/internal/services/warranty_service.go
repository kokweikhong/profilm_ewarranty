package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
)

type WarrantyService interface {
	ListCarParts(ctx context.Context) ([]*warranties.CarPart, error)
	GetCarPartByID(ctx context.Context, id uuid.UUID) (*warranties.CarPart, error)
	CreateCarPart(ctx context.Context, params *warranties.CreateCarPartParams) (*warranties.CarPart, error)
	UpdateCarPart(ctx context.Context, id uuid.UUID, params *warranties.UpdateCarPartParams) (*warranties.CarPart, error)
	DeleteCarPart(ctx context.Context, id uuid.UUID) error

	ListWarranties(ctx context.Context) ([]*warranties.Warranty, error)
	GetWarrantyByID(ctx context.Context, id uuid.UUID) (*warranties.Warranty, error)
	CreateWarranty(ctx context.Context, params *warranties.CreateWarrantyParams) (*warranties.Warranty, error)
	UpdateWarranty(ctx context.Context, id uuid.UUID, params *warranties.UpdateWarrantyParams) (*warranties.Warranty, error)
	DeleteWarranty(ctx context.Context, id uuid.UUID) error
}

type warrantyService struct {
	db     *pgxpool.Pool
	queries *warranties.Queries
}

func NewWarrantyService(db *pgxpool.Pool, queries *warranties.Queries) WarrantyService {
	return &warrantyService{
		db:     db,
		queries: queries,
	}
}

// ListCarParts lists all car parts
func (s *warrantyService) ListCarParts(ctx context.Context) ([]*warranties.CarPart, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	carParts, err := qtx.ListCarParts(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return carParts, nil
}

// GetCarPartByID retrieves a car part by its ID
func (s *warrantyService) GetCarPartByID(ctx context.Context, id uuid.UUID) (*warranties.CarPart, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	carPart, err := qtx.GetCarPartByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return carPart, nil
}

// CreateCarPart creates a new car part
func (s *warrantyService) CreateCarPart(ctx context.Context, params *warranties.CreateCarPartParams) (*warranties.CarPart, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	carPart, err := qtx.CreateCarPart(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return carPart, nil
}

// UpdateCarPart updates an existing car part
func (s *warrantyService) UpdateCarPart(ctx context.Context, id uuid.UUID, params *warranties.UpdateCarPartParams) (*warranties.CarPart, error) {
	params.ID = id
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	carPart, err := qtx.UpdateCarPart(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return carPart, nil
}

// DeleteCarPart deletes a car part by its ID
func (s *warrantyService) DeleteCarPart(ctx context.Context, id uuid.UUID) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	if err := qtx.DeleteCarPart(ctx, id); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}

// ListWarranties lists all warranties
func (s *warrantyService) ListWarranties(ctx context.Context) ([]*warranties.Warranty, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	warranties, err := qtx.ListWarranties(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return warranties, nil
}

// GetWarrantyByID retrieves a warranty by its ID
func (s *warrantyService) GetWarrantyByID(ctx context.Context, id uuid.UUID) (*warranties.Warranty, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	warranty, err := qtx.GetWarrantyByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return warranty, nil
}

// CreateWarranty creates a new warranty
func (s *warrantyService) CreateWarranty(ctx context.Context, params *warranties.CreateWarrantyParams) (*warranties.Warranty, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	warranty, err := qtx.CreateWarranty(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return warranty, nil
}

// UpdateWarranty updates an existing warranty
func (s *warrantyService) UpdateWarranty(ctx context.Context, id uuid.UUID, params *warranties.UpdateWarrantyParams) (*warranties.Warranty, error) {
	params.ID = id
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	warranty, err := qtx.UpdateWarranty(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return warranty, nil
}

// DeleteWarranty deletes a warranty by its ID
func (s *warrantyService) DeleteWarranty(ctx context.Context, id uuid.UUID) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	if err := qtx.DeleteWarranty(ctx, id); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}