package services

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
)

type WarrantiesService interface {
	ListWarranties(ctx context.Context) ([]*warranties.Warranty, error)
	GetWarrantyByID(ctx context.Context, id int32) (*warranties.Warranty, error)
	CreateWarranty(ctx context.Context, arg *warranties.CreateWarrantyParams) (*warranties.Warranty, error)
	UpdateWarranty(ctx context.Context, arg *warranties.UpdateWarrantyParams) (*warranties.Warranty, error)
	UpdateWarrantyApproval(ctx context.Context, arg *warranties.UpdateWarrantyApprovalParams) (*warranties.Warranty, error)

	GetWarrantyByWarrantyNo(ctx context.Context, warrantyNo string) (*warranties.Warranty, error)
	GetWarrantiesByCarPlateNo(ctx context.Context, carPlateNo string) ([]*warranties.Warranty, error)

	GetWarrantiesBySearchTerm(ctx context.Context, searchTerm string) ([]*warranties.Warranty, error)

	GetCarParts(ctx context.Context) ([]*warranties.CarPart, error)

	CreateWarrantyPart(ctx context.Context, arg *warranties.CreateWarrantyPartParams) (*warranties.WarrantyPart, error)
	UpdateWarrantyPart(ctx context.Context, arg *warranties.UpdateWarrantyPartParams) (*warranties.WarrantyPart, error)
	UpdateWarrantyPartApproval(ctx context.Context, arg *warranties.UpdateWarrantyPartApprovalParams) (*warranties.WarrantyPart, error)
	GetWarrantyPartsByWarrantyID(ctx context.Context, warrantyID int32) ([]*warranties.WarrantyPart, error)

	CreateWarrantyWithParts(ctx context.Context, warrantyArg *warranties.CreateWarrantyParams, partsArgs []*warranties.CreateWarrantyPartParams) (*warranties.Warranty, error)
	UpdateWarrantyWithParts(ctx context.Context, warrantyArg *warranties.UpdateWarrantyParams, partsArgs []*warranties.UpdateWarrantyPartParams) (*warranties.Warranty, error)

	GenerateNextWarrantyNo(ctx context.Context, branchCode string, installationDate string) (string, error)
}

type warrantiesService struct {
	db *pgxpool.Pool
	q  *warranties.Queries
}

func NewWarrantiesService(db *pgxpool.Pool) WarrantiesService {
	return &warrantiesService{
		db: db,
		q:  warranties.New(db),
	}
}

// ListWarranties retrieves a list of warranties from the database.
func (s *warrantiesService) ListWarranties(ctx context.Context) ([]*warranties.Warranty, error) {
	return s.q.ListWarranties(ctx)
}

// GetWarrantyByID retrieves a warranty by its ID from the database.
func (s *warrantiesService) GetWarrantyByID(ctx context.Context, id int32) (*warranties.Warranty, error) {
	return s.q.GetWarrantyByID(ctx, id)
}

// CreateWarranty creates a new warranty in the database.
func (s *warrantiesService) CreateWarranty(ctx context.Context, arg *warranties.CreateWarrantyParams) (*warranties.Warranty, error) {
	return s.q.CreateWarranty(ctx, arg)
}

// UpdateWarranty updates an existing warranty in the database.
func (s *warrantiesService) UpdateWarranty(ctx context.Context, arg *warranties.UpdateWarrantyParams) (*warranties.Warranty, error) {
	return s.q.UpdateWarranty(ctx, arg)
}

// UpdateWarrantyApproval updates the approval status of a warranty in the database.
func (s *warrantiesService) UpdateWarrantyApproval(ctx context.Context, arg *warranties.UpdateWarrantyApprovalParams) (*warranties.Warranty, error) {
	return s.q.UpdateWarrantyApproval(ctx, arg)
}

// GetWarrantyByWarrantyNo retrieves a warranty by its warranty number from the database.
func (s *warrantiesService) GetWarrantyByWarrantyNo(ctx context.Context, warrantyNo string) (*warranties.Warranty, error) {
	return s.q.GetWarrantyByWarrantyNo(ctx, warrantyNo)
}

// GetWarrantiesByCarPlateNo retrieves warranties by their car plate number from the database.
func (s *warrantiesService) GetWarrantiesByCarPlateNo(ctx context.Context, carPlateNo string) ([]*warranties.Warranty, error) {
	return s.q.GetWarrantiesByCarPlateNo(ctx, carPlateNo)
}

// GetWarrantiesBySearchTerm retrieves warranties matching a search term from the database.
func (s *warrantiesService) GetWarrantiesBySearchTerm(ctx context.Context, searchTerm string) ([]*warranties.Warranty, error) {
	return s.q.GetWarrantiesBySearchTerm(ctx, &searchTerm)
}

// GetCarParts retrieves a list of car parts from the database.
func (s *warrantiesService) GetCarParts(ctx context.Context) ([]*warranties.CarPart, error) {
	return s.q.GetCarParts(ctx)
}

// CreateWarrantyPart creates a new warranty part in the database.
func (s *warrantiesService) CreateWarrantyPart(ctx context.Context, arg *warranties.CreateWarrantyPartParams) (*warranties.WarrantyPart, error) {
	return s.q.CreateWarrantyPart(ctx, arg)
}

// UpdateWarrantyPart updates a warranty part in the database.
func (s *warrantiesService) UpdateWarrantyPart(ctx context.Context, arg *warranties.UpdateWarrantyPartParams) (*warranties.WarrantyPart, error) {
	result, err := s.q.UpdateWarrantyPart(ctx, arg)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateWarrantryPartApproval updates the approval status of a warranty part in the database.
func (s *warrantiesService) UpdateWarrantyPartApproval(ctx context.Context, arg *warranties.UpdateWarrantyPartApprovalParams) (*warranties.WarrantyPart, error) {
	return s.q.UpdateWarrantyPartApproval(ctx, arg)
}

// GetWarrantyPartsByWarrantyID retrieves warranty parts by warranty ID from the database.
func (s *warrantiesService) GetWarrantyPartsByWarrantyID(ctx context.Context, warrantyID int32) ([]*warranties.WarrantyPart, error) {
	return s.q.GetWarrantyPartsByWarrantyID(ctx, warrantyID)
}

// CreateWarrantyWithParts creates a new warranty along with its associated parts in a transaction.
func (s *warrantiesService) CreateWarrantyWithParts(ctx context.Context, warrantyArg *warranties.CreateWarrantyParams, partsArgs []*warranties.CreateWarrantyPartParams) (*warranties.Warranty, error) {
	// use a transaction to ensure both warranty and parts are created successfully
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}

	qtx := warranties.New(tx)

	warranty, err := qtx.CreateWarranty(ctx, warrantyArg)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}

	// Create parts associated with the warranty
	for _, partArg := range partsArgs {
		partArg.WarrantyID = warranty.ID
	}

	for _, partArg := range partsArgs {
		_, err = qtx.CreateWarrantyPart(ctx, partArg)
		if err != nil {
			tx.Rollback(ctx)
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return warranty, nil
}

// UpdateWarrantyWithParts updates an existing warranty along with its associated parts in a transaction.
func (s *warrantiesService) UpdateWarrantyWithParts(ctx context.Context, warrantyArg *warranties.UpdateWarrantyParams, partsArgs []*warranties.UpdateWarrantyPartParams) (*warranties.Warranty, error) {
	// use a transaction to ensure both warranty and parts are updated successfully
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	qtx := warranties.New(tx)

	warranty, err := qtx.UpdateWarranty(ctx, warrantyArg)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	// Update parts associated with the warranty
	for _, partArg := range partsArgs {
		partArg.WarrantyID = warranty.ID
		_, err = qtx.UpdateWarrantyPart(ctx, partArg)
		if err != nil {
			tx.Rollback(ctx)
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return warranty, nil
}

// GenerateNextWarrantyNo generates the next warranty number based on a given prefix.
// eg Branch Code - Warranty Date (Installation Date) + Warranty Sequence, e.g. PJ01-24112501
// branchCode and installationDate as params
// branchcode-installdate-sequence
func (s *warrantiesService) GenerateNextWarrantyNo(ctx context.Context, branchCode string, installationDate string) (string, error) {
	// Get the latest warranty number with the same prefix to determine the next sequence
	prefix := branchCode + "-" + installationDate
	warrantyNo, err := s.q.GetLatestWarrantyNoByPrefix(ctx, prefix+"%")
	if err != nil {
		// If no existing warranty found, start with sequence 01
		return prefix + "01", nil
	}

	// Extract sequence number from latest warranty number
	// Format: branchcode-installdate-sequence (e.g., PJ01-24112501)
	sequencePart := warrantyNo[len(prefix):]

	// Convert sequence to integer and increment
	var sequence int
	if _, err := fmt.Sscanf(sequencePart, "%d", &sequence); err != nil {
		return "", fmt.Errorf("failed to parse sequence from warranty number: %w", err)
	}

	sequence++

	// Format new warranty number with zero-padded sequence
	return fmt.Sprintf("%s%02d", prefix, sequence), nil
}
