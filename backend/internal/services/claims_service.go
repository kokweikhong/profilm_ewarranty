package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
)

type ClaimsService interface {
	GetClaimsByShopID(ctx context.Context, shopID int32) ([]*claims.Claim, error)
	ListClaims(ctx context.Context) ([]*claims.Claim, error)
	GetClaimByID(ctx context.Context, id int32) (*claims.Claim, error)
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

// GetClaimsByShopID retrieves claims associated with a specific shop ID from the database.
func (s *claimsService) GetClaimsByShopID(ctx context.Context, shopID int32) ([]*claims.Claim, error) {
	return s.q.GetClaimsByShopID(ctx, shopID)
}

// ListClaims retrieves a list of claims from the database.
func (s *claimsService) ListClaims(ctx context.Context) ([]*claims.Claim, error) {
	return s.q.ListClaims(ctx)
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
