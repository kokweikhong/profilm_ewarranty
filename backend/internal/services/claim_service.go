package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
)

type ClaimService interface {
	ListClaims(ctx context.Context) ([]*claims.Claim, error)
	GetClaimByID(ctx context.Context, id uuid.UUID) (*claims.Claim, error)
	CreateClaim(ctx context.Context, params *claims.CreateClaimParams) (*claims.Claim, error)
	UpdateClaim(ctx context.Context, params *claims.UpdateClaimParams) (*claims.Claim, error)
	DeleteClaim(ctx context.Context, id uuid.UUID) error

	ListClaimsDetails(ctx context.Context) ([]*claims.ClaimDetail, error)
}

type claimService struct {
	db      *pgxpool.Pool
	queries *claims.Queries
}

// NewClaimService creates a new ClaimService
func NewClaimService(db *pgxpool.Pool, queries *claims.Queries) ClaimService {
	return &claimService{
		db:      db,
		queries: queries,
	}
}

// ListClaims lists all claims
func (s *claimService) ListClaims(ctx context.Context) ([]*claims.Claim, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}

	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	claimsList, err := qtx.ListClaims(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claimsList, nil
}

// GetClaimByID retrieves a claim by its ID
func (s *claimService) GetClaimByID(ctx context.Context, id uuid.UUID) (*claims.Claim, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	claim, err := qtx.GetClaimByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claim, nil
}

// CreateClaim creates a new claim
func (s *claimService) CreateClaim(ctx context.Context, params *claims.CreateClaimParams) (*claims.Claim, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	claim, err := qtx.CreateClaim(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claim, nil
}

// UpdateClaim updates an existing claim
func (s *claimService) UpdateClaim(ctx context.Context, params *claims.UpdateClaimParams) (*claims.Claim, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	claim, err := qtx.UpdateClaim(ctx, params)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claim, nil
}

// DeleteClaim deletes a claim by its ID
func (s *claimService) DeleteClaim(ctx context.Context, id uuid.UUID) error {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	if err := qtx.DeleteClaim(ctx, id); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}

// ListClaimsDetails lists all claim details
func (s *claimService) ListClaimsDetails(ctx context.Context) ([]*claims.ClaimDetail, error) {
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)
	claimDetails, err := qtx.ListClaimDetails(ctx)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return claimDetails, nil
}