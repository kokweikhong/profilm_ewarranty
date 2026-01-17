package services

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
)

type WarrantiesService interface {
	ListWarranties(ctx context.Context) ([]*warranties.ListWarrantiesRow, error)
	GetWarrantyByID(ctx context.Context, id int32) (*warranties.Warranty, error)
	GetWarrantiesByShopID(ctx context.Context, shopID int32) ([]*warranties.GetWarrantiesByShopIDRow, error)
	// CreateWarranty(ctx context.Context, arg *warranties.CreateWarrantyParams) (*warranties.Warranty, error)
	// GetWarrantyWithPartsByID(ctx context.Context, id int32) (*warranties.GetWarrantyWithPartsByIDRow, error)
	CreateWarrantyWithParts(ctx context.Context, warrantyArg *warranties.CreateWarrantyParams, partsArgs []*warranties.CreateWarrantyPartParams) (*warranties.Warranty, error)
	UpdateWarrantyWithParts(ctx context.Context, warrantyArg *warranties.UpdateWarrantyParams, partsArgs []*warranties.UpdateWarrantyPartParams) (*warranties.Warranty, error)
	UpdateWarrantyApproval(ctx context.Context, arg *warranties.UpdateWarrantyApprovalParams) (*warranties.Warranty, error)

	GetWarrantiesByExactSearch(ctx context.Context, searchTerm string) ([]*warranties.GetWarrantiesByExactSearchRow, error)

	GetCarParts(ctx context.Context) ([]*warranties.CarPart, error)

	CreateWarrantyPart(ctx context.Context, arg *warranties.CreateWarrantyPartParams) (*warranties.WarrantyPart, error)
	UpdateWarrantyPart(ctx context.Context, arg *warranties.UpdateWarrantyPartParams) (*warranties.WarrantyPart, error)
	UpdateWarrantyPartApproval(ctx context.Context, arg *warranties.UpdateWarrantyPartApprovalParams) (*warranties.WarrantyPart, error)
	GetWarrantyPartsByWarrantyID(ctx context.Context, warrantyID int32) ([]*warranties.GetWarrantyPartsByWarrantyIDRow, error)

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
func (s *warrantiesService) ListWarranties(ctx context.Context) ([]*warranties.ListWarrantiesRow, error) {
	return s.q.ListWarranties(ctx)
}

// GetWarrantyByID retrieves a warranty by its ID from the database.
func (s *warrantiesService) GetWarrantyByID(ctx context.Context, id int32) (*warranties.Warranty, error) {
	return s.q.GetWarrantyByID(ctx, id)
}

// GetWarrantiesByShopID retrieves warranties by shop ID from the database.
func (s *warrantiesService) GetWarrantiesByShopID(ctx context.Context, shopID int32) ([]*warranties.GetWarrantiesByShopIDRow, error) {
	return s.q.GetWarrantiesByShopID(ctx, shopID)
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

	// Delete parts that are duplicated in car_part_id for the same warranty
	// to avoid multiple parts with the same car_part_id for a warranty
	// delete the based on updated_at timestamp
	existingParts, err := qtx.GetWarrantyPartsByWarrantyID(ctx, warranty.ID)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	existingPartsMap := make(map[int32][]*warranties.GetWarrantyPartsByWarrantyIDRow)
	for _, part := range existingParts {
		existingPartsMap[part.CarPartID] = append(existingPartsMap[part.CarPartID], part)
	}
	for _, parts := range existingPartsMap {
		if len(parts) > 1 {
			// sort parts by updated_at descending
			// delete all but the latest one
			latestPart := parts[0]
			for _, part := range parts[1:] {
				if part.UpdatedAt.After(latestPart.UpdatedAt) {
					latestPart = part
				}
			}
			for _, part := range parts {
				if part.ID != latestPart.ID {
					err = qtx.DeleteWarrantyPart(ctx, part.ID)
					if err != nil {
						tx.Rollback(ctx)
						return nil, err
					}
				}
			}
		}
	}

	// remove warranty parts that are not in the updated partsArgs
	updatedPartIDs := make(map[int32]struct{})
	for _, partArg := range partsArgs {
		updatedPartIDs[partArg.ID] = struct{}{}
	}
	for _, existingPart := range existingParts {
		if _, ok := updatedPartIDs[existingPart.ID]; !ok {
			err = qtx.DeleteWarrantyPart(ctx, existingPart.ID)
			if err != nil {
				tx.Rollback(ctx)
				return nil, err
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return warranty, nil
}

// UpdateWarrantyApproval updates the approval status of a warranty in the database.
func (s *warrantiesService) UpdateWarrantyApproval(ctx context.Context, arg *warranties.UpdateWarrantyApprovalParams) (*warranties.Warranty, error) {
	// Update the warranty approval status
	// if true then all warranty parts should also be approved
	// use a transaction to ensure both warranty and parts are updated successfully
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	qtx := warranties.New(tx)
	warranty, err := qtx.UpdateWarrantyApproval(ctx, arg)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	// approvalStatus := arg.ApprovalStatus.Scan()
	// get all warranty parts associated with the warranty
	parts, err := qtx.GetWarrantyPartsByWarrantyID(ctx, arg.ID)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	// update each part to approved
	for _, part := range parts {
		_, err = qtx.UpdateWarrantyPartApproval(ctx, &warranties.UpdateWarrantyPartApprovalParams{
			ID:             part.ID,
			ApprovalStatus: arg.ApprovalStatus,
		})
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

// GetWarrantiesByExactSearch retrieves warranties with their parts matching an exact search term from the database.
func (s *warrantiesService) GetWarrantiesByExactSearch(ctx context.Context, searchTerm string) ([]*warranties.GetWarrantiesByExactSearchRow, error) {
	return s.q.GetWarrantiesByExactSearch(ctx, searchTerm)
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
	return s.q.UpdateWarrantyPart(ctx, arg)
}

// UpdateWarrantryPartApproval updates the approval status of a warranty part in the database.
func (s *warrantiesService) UpdateWarrantyPartApproval(ctx context.Context, arg *warranties.UpdateWarrantyPartApprovalParams) (*warranties.WarrantyPart, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	qtx := warranties.New(tx)
	// Get all warranty parts associated with the warranty
	warrantyPart, err := qtx.GetWarrantyPartByID(ctx, arg.ID)
	if err != nil {
		// log error
		log.Printf("Failed to get warranty part by ID: %v", err)
		tx.Rollback(ctx)
		return nil, err
	}
	warranty, err := qtx.GetWarrantyByID(ctx, warrantyPart.WarrantyID)
	if err != nil {
		tx.Rollback(ctx)
		// log error
		log.Printf("Failed to get warranty by ID: %v", err)
		return nil, err
	}
	parts, err := qtx.GetWarrantyPartsByWarrantyID(ctx, warranty.ID)
	if err != nil {
		// log error
		log.Printf("Failed to get warranty parts by warranty ID: %v", err)
		tx.Rollback(ctx)
		return nil, err
	}

	result, err := qtx.UpdateWarrantyPartApproval(ctx, arg)
	if err != nil {
		// log error
		log.Printf("Failed to update current warranty part approval: %v", err)
		tx.Rollback(ctx)
		return nil, err
	}

	isAllApproved := true
	isAllRejected := true

	// Check if updating this part to approved would result in all parts being approved
	if strings.ToLower(string(arg.ApprovalStatus)) == "approved" {
		for _, part := range parts {

			if part.ID != arg.ID && strings.ToLower(string(part.ApprovalStatus)) != "approved" {
				isAllApproved = false
				break
			}
		}
	}

	// Check if updating this part to rejected would result in all parts being rejected
	if strings.ToLower(string(arg.ApprovalStatus)) == "rejected" {
		for _, part := range parts {
			if part.ID != arg.ID && strings.ToLower(string(part.ApprovalStatus)) != "rejected" {
				isAllRejected = false
				break
			}
		}
	}

	for _, part := range parts {
		status := part.ApprovalStatus
		if part.ID == arg.ID {
			status = arg.ApprovalStatus // use the new status for the updated part
		}
		if strings.ToLower(string(status)) != "approved" {
			isAllApproved = false
		}
		if strings.ToLower(string(status)) != "rejected" {
			isAllRejected = false
		}
	}

	if isAllApproved {
		// If all parts are approved, update the warranty to approved as well
		_, err = qtx.UpdateWarrantyApproval(ctx, &warranties.UpdateWarrantyApprovalParams{
			ID:             warranty.ID,
			ApprovalStatus: "APPROVED",
		})
		if err != nil {
			log.Printf("Failed to update warranty approval: %v", err)
			tx.Rollback(ctx)
			return nil, err
		}
	}
	if isAllRejected {
		// If all parts are rejected, update the warranty to rejected as well
		_, err = qtx.UpdateWarrantyApproval(ctx, &warranties.UpdateWarrantyApprovalParams{
			ID:             warranty.ID,
			ApprovalStatus: "REJECTED",
		})
		if err != nil {
			log.Printf("Failed to update warranty approval: %v", err)
			tx.Rollback(ctx)
			return nil, err
		}
	}

	if !isAllApproved && !isAllRejected {
		// Otherwise, ensure the warranty is set to pending and update current part as approved
		_, err = qtx.UpdateWarrantyApproval(ctx, &warranties.UpdateWarrantyApprovalParams{
			ID:             warranty.ID,
			ApprovalStatus: "PENDING",
		})
		if err != nil {
			log.Printf("Failed to update warranty approval: %v", err)
			tx.Rollback(ctx)
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return result, nil
}

// GetWarrantyPartsByWarrantyID retrieves warranty parts by warranty ID from the database.
func (s *warrantiesService) GetWarrantyPartsByWarrantyID(ctx context.Context, warrantyID int32) ([]*warranties.GetWarrantyPartsByWarrantyIDRow, error) {
	return s.q.GetWarrantyPartsByWarrantyID(ctx, warrantyID)
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
