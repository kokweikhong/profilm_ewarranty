package services

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
)

type ClaimsService interface {
	ListClaims(ctx context.Context) ([]*claims.ListClaimsRow, error)
	GetClaimsByShopID(ctx context.Context, shopID int32) ([]*claims.GetClaimsByShopIDRow, error)
	GetClaimByID(ctx context.Context, id int32) (*claims.Claim, error)
	GenerateNextClaimNo(ctx context.Context, warrantyNo, claimDate string) (string, error)
	CreateClaim(ctx context.Context, arg *claims.CreateClaimParams) (*claims.Claim, error)
	UpdateClaim(ctx context.Context, arg *claims.UpdateClaimParams) (*claims.Claim, error)
	UpdateClaimApproval(ctx context.Context, arg *claims.UpdateClaimApprovalParams) (*claims.Claim, error)

	ListClaimWarrantyPartsByClaimID(ctx context.Context, claimID int32) ([]*claims.ClaimWarrantyPart, error)
	CreateClaimWarrantyPart(ctx context.Context, arg *claims.CreateClaimWarrantyPartParams) (*claims.ClaimWarrantyPart, error)
	UpdateClaimWarrantyPart(ctx context.Context, arg *claims.UpdateClaimWarrantyPartParams) (*claims.ClaimWarrantyPart, error)
	UpdateClaimWarrantyPartApproval(ctx context.Context, arg *claims.UpdateClaimWarrantyPartApprovalParams) (*claims.ClaimWarrantyPart, error)
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

// ListClaims retrieves a list of claims from the database.
func (s *claimsService) ListClaims(ctx context.Context) ([]*claims.ListClaimsRow, error) {
	return s.q.ListClaims(ctx)
}

// GetClaimsByShopID retrieves claims associated with a specific shop ID from the database.
func (s *claimsService) GetClaimsByShopID(ctx context.Context, shopID int32) ([]*claims.GetClaimsByShopIDRow, error) {
	return s.q.GetClaimsByShopID(ctx, shopID)
}

// GetClaimByID retrieves a claim by its ID from the database.
func (s *claimsService) GetClaimByID(ctx context.Context, id int32) (*claims.Claim, error) {
	return s.q.GetClaimByID(ctx, id)
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
	return s.q.UpdateClaimApproval(ctx, arg)
}

// ListClaimWarrantyPartsByClaimID retrieves claim warranty parts by claim ID from the database.
func (s *claimsService) ListClaimWarrantyPartsByClaimID(ctx context.Context, claimID int32) ([]*claims.ClaimWarrantyPart, error) {
	return s.q.ListClaimWarrantyPartsByClaimID(ctx, claimID)
}

// CreateClaimWarrantyPart creates a new claim warranty part in the database.
func (s *claimsService) CreateClaimWarrantyPart(ctx context.Context, arg *claims.CreateClaimWarrantyPartParams) (*claims.ClaimWarrantyPart, error) {
	return s.q.CreateClaimWarrantyPart(ctx, arg)
}

// UpdateClaimWarrantyPart updates an existing claim warranty part in the database.
func (s *claimsService) UpdateClaimWarrantyPart(ctx context.Context, arg *claims.UpdateClaimWarrantyPartParams) (*claims.ClaimWarrantyPart, error) {
	return s.q.UpdateClaimWarrantyPart(ctx, arg)
}

// UpdateClaimWarrantyPartApproval updates the approval status of a claim warranty part in the database.
func (s *claimsService) UpdateClaimWarrantyPartApproval(ctx context.Context, arg *claims.UpdateClaimWarrantyPartApprovalParams) (*claims.ClaimWarrantyPart, error) {
	return s.q.UpdateClaimWarrantyPartApproval(ctx, arg)
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
