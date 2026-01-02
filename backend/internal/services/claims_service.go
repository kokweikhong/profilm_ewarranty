package services

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
)

type ClaimsService interface {
	GetClaims(ctx context.Context) ([]*claims.ClaimView, error)
	GetClaimsByShopID(ctx context.Context, shopID int32) ([]*claims.ClaimView, error)
	GetClaimByID(ctx context.Context, id int32) (*claims.ClaimView, error)
	GetClaimWarrantyPartsByClaimID(ctx context.Context, claimID int32) ([]*claims.ClaimWarrantyPartsView, error)
	GenerateNextClaimNo(ctx context.Context, warrantyNo, claimDate string) (string, error)

	CreateClaimWithParts(ctx context.Context, arg *claims.CreateClaimParams, partsArgs []*claims.CreateClaimWarrantyPartParams) (*claims.Claim, error)
	UpdateClaimWithParts(ctx context.Context, claimArg *claims.UpdateClaimParams, partsArgs []*claims.UpdateClaimWarrantyPartParams) (*claims.Claim, error)

	UpdateClaimApproval(ctx context.Context, arg *claims.UpdateClaimApprovalParams) (*claims.Claim, error)
	UpdateClaimWarrantyPartApproval(ctx context.Context, arg *claims.UpdateClaimWarrantyPartApprovalParams) (*claims.ClaimWarrantyPart, error)
	UpdateClaimStatus(ctx context.Context, claimID int32, isOpen bool) (*claims.Claim, error)
	UpdateClaimWarrantyPartStatus(ctx context.Context, partID int32, isOpen bool) (*claims.ClaimWarrantyPart, error)
}

type claimsService struct {
	db *pgxpool.Pool
	q  *claims.Queries
}

func NewClaimsService(db *pgxpool.Pool) ClaimsService {
	return &claimsService{
		db: db,
		q:  claims.New(db),
	}
}

// GetClaims retrieves a list of claims from the database.
func (s *claimsService) GetClaims(ctx context.Context) ([]*claims.ClaimView, error) {
	return s.q.GetClaims(ctx)
}

// GetClaimsByShopID retrieves claims associated with a specific shop ID from the database.
func (s *claimsService) GetClaimsByShopID(ctx context.Context, shopID int32) ([]*claims.ClaimView, error) {
	return s.q.GetClaimsByShopID(ctx, shopID)
}

// GetClaimByID retrieves a claim by its ID from the database.
func (s *claimsService) GetClaimByID(ctx context.Context, id int32) (*claims.ClaimView, error) {
	return s.q.GetClaimByID(ctx, id)
}

// GetClaimWarrantyPartsByClaimID retrieves warranty parts associated with a specific claim ID from the database.
func (s *claimsService) GetClaimWarrantyPartsByClaimID(ctx context.Context, claimID int32) ([]*claims.ClaimWarrantyPartsView, error) {
	return s.q.GetClaimWarrantyPartsByClaimID(ctx, claimID)
}

// CreateClaimWithParts creates a new claim along with its associated warranty parts in the database.
func (s *claimsService) CreateClaimWithParts(ctx context.Context, arg *claims.CreateClaimParams, partsArgs []*claims.CreateClaimWarrantyPartParams) (*claims.Claim, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	qtx := claims.New(tx)
	claim, err := qtx.CreateClaim(ctx, arg)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	for _, partArg := range partsArgs {
		partArg.ClaimID = claim.ID
		_, err := qtx.CreateClaimWarrantyPart(ctx, partArg)
		if err != nil {
			tx.Rollback(ctx)
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claim, nil
}

// UpdateClaimWithParts updates an existing claim along with its associated warranty parts in the database.
func (s *claimsService) UpdateClaimWithParts(ctx context.Context, claimArg *claims.UpdateClaimParams, partsArgs []*claims.UpdateClaimWarrantyPartParams) (*claims.Claim, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	qtx := claims.New(tx)
	claim, err := qtx.UpdateClaim(ctx, claimArg)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	for _, partArg := range partsArgs {
		_, err := qtx.UpdateClaimWarrantyPart(ctx, partArg)
		if err != nil {
			tx.Rollback(ctx)
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claim, nil
}

// CreateClaim creates a new claim in the database.
func (s *claimsService) CreateClaim(ctx context.Context, arg *claims.CreateClaimParams) (*claims.Claim, error) {
	return s.q.CreateClaim(ctx, arg)
}

// UpdateClaim updates an existing claim in the database.
func (s *claimsService) UpdateClaim(ctx context.Context, arg *claims.UpdateClaimParams) (*claims.Claim, error) {
	return s.q.UpdateClaim(ctx, arg)
}

// UpdateClaimApproval updates the approval status of a claim in the database.
func (s *claimsService) UpdateClaimApproval(ctx context.Context, arg *claims.UpdateClaimApprovalParams) (*claims.Claim, error) {
	// if claim is approved, all claim warranty parts need to be approved
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	qtx := claims.New(tx)
	claim, err := qtx.UpdateClaimApproval(ctx, arg)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	// update all claim warranty parts approval status
	parts, err := qtx.GetClaimWarrantyPartsByClaimID(ctx, arg.ID)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	for _, part := range parts {
		partArg := &claims.UpdateClaimWarrantyPartApprovalParams{
			ID:         part.ID,
			IsApproved: arg.IsApproved,
		}
		_, err := qtx.UpdateClaimWarrantyPartApproval(ctx, partArg)
		if err != nil {
			tx.Rollback(ctx)
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claim, nil
}

// UpdateClaimWarrantyPartApproval updates the approval status of a claim warranty part in the database.
func (s *claimsService) UpdateClaimWarrantyPartApproval(ctx context.Context, arg *claims.UpdateClaimWarrantyPartApprovalParams) (*claims.ClaimWarrantyPart, error) {
	// if claim warranty part is approved, check if all parts are approved to update claim approval status
	part, err := s.q.UpdateClaimWarrantyPartApproval(ctx, arg)
	if err != nil {
		return nil, err
	}
	if arg.IsApproved {
		parts, err := s.q.GetClaimWarrantyPartsByClaimID(ctx, part.ClaimID)
		if err != nil {
			return nil, err
		}
		allApproved := true
		for _, p := range parts {
			if !p.IsApproved {
				allApproved = false
				break
			}
		}
		if allApproved {
			claimArg := &claims.UpdateClaimApprovalParams{
				ID:         part.ClaimID,
				IsApproved: true,
			}
			_, err := s.q.UpdateClaimApproval(ctx, claimArg)
			if err != nil {
				return nil, err
			}
		} else {
			claimArg := &claims.UpdateClaimApprovalParams{
				ID:         part.ClaimID,
				IsApproved: false,
			}
			_, err := s.q.UpdateClaimApproval(ctx, claimArg)
			if err != nil {
				return nil, err
			}
		}
	}
	return part, nil
}

// UpdateClaimStatus updates the status of a claim in the database.
func (s *claimsService) UpdateClaimStatus(ctx context.Context, claimID int32, isOpen bool) (*claims.Claim, error) {
	var status string
	if isOpen {
		status = "Open"
	} else {
		status = "Closed"
	}
	// if closed and claim warranty part all need to be closed
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	qtx := claims.New(tx)
	arg := &claims.UpdateClaimStatusParams{
		ID:     claimID,
		Status: status,
	}
	claim, err := qtx.UpdateClaimStatus(ctx, arg)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}
	// update all claim warranty parts status if claim is closed
	parts, err := qtx.GetClaimWarrantyPartsByClaimID(ctx, claimID)
	if err != nil {
		tx.Rollback(ctx)
		return nil, err
	}

	for _, part := range parts {
		partArg := &claims.UpdateClaimWarrantyPartStatusParams{
			ID:     part.ID,
			Status: status,
		}
		_, err := qtx.UpdateClaimWarrantyPartStatus(ctx, partArg)
		if err != nil {
			tx.Rollback(ctx)
			return nil, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claim, nil
}

// UpdateClaimWarrantyPartStatus updates the status of a claim warranty part in the database.
func (s *claimsService) UpdateClaimWarrantyPartStatus(ctx context.Context, partID int32, isOpen bool) (*claims.ClaimWarrantyPart, error) {
	// if closed, check if all parts are closed to update claim status
	var status string
	if isOpen {
		status = "Open"
	} else {
		status = "Closed"
	}
	arg := &claims.UpdateClaimWarrantyPartStatusParams{
		ID:     partID,
		Status: status,
	}
	part, err := s.q.UpdateClaimWarrantyPartStatus(ctx, arg)
	if err != nil {
		return nil, err
	}
	if !isOpen {
		parts, err := s.q.GetClaimWarrantyPartsByClaimID(ctx, part.ClaimID)
		if err != nil {
			return nil, err
		}
		allClosed := true
		for _, p := range parts {
			if p.Status != "Closed" {
				allClosed = false
				break
			}
		}
		if allClosed {
			claimArg := &claims.UpdateClaimStatusParams{
				ID:     part.ClaimID,
				Status: "Closed",
			}
			_, err := s.q.UpdateClaimStatus(ctx, claimArg)
			if err != nil {
				return nil, err
			}
		} else {
			claimArg := &claims.UpdateClaimStatusParams{
				ID:     part.ClaimID,
				Status: "Open",
			}
			_, err := s.q.UpdateClaimStatus(ctx, claimArg)
			if err != nil {
				return nil, err
			}
		}
	}
	return part, nil

}

// GenerateNextClaimNo generates the next claim number based on the warranty number.
// C + Claim Date - Warranty No. - Claim Sequence
// E.g. C251031-PJ01-24112501-01
func (s *claimsService) GenerateNextClaimNo(ctx context.Context, warrantyNo, claimDate string) (string, error) {
	// This is a placeholder implementation. You should implement the logic to generate the claim number based on your requirements.
	// For example, you might want to query the database to find the last claim number for the given warranty and increment it.
	prefix := "C" + claimDate + "-" + warrantyNo + "-"
	latestClaimNo, err := s.q.GetLatestWarrantyNoByPrefix(ctx, prefix+"%")
	if err != nil {
		// If no existing claim found, start with sequence 01
		return prefix + "01", nil
	}
	// Extract the sequence number from the latest claim number and increment it
	sequencePart := latestClaimNo[len(prefix):]
	// Convert sequence to integer and increment
	var nextSequence int
	fmt.Sscanf(sequencePart, "%02d", &nextSequence)
	nextSequence++
	return fmt.Sprintf("%s%02d", prefix, nextSequence), nil
}
