package services

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
)

type ShopsService interface {
	ListMsiaStates(ctx context.Context) ([]*shops.MsiaState, error)
	GetMsiaStateByID(ctx context.Context, id int32) (*shops.MsiaState, error)
	ListShopsView(ctx context.Context) ([]*shops.ShopsView, error)
	GetShopByID(ctx context.Context, id int32) (*shops.GetShopByIDRow, error)
	CreateShop(ctx context.Context, arg *shops.CreateShopParams) (*shops.Shop, error)
	UpdateShop(ctx context.Context, arg *shops.UpdateShopParams) (*shops.Shop, error)
	UpdateShopPassword(ctx context.Context, shopID int32, newPasswordHash string) (*shops.Shop, error)
	GenerateNextBranchCode(ctx context.Context, stateCode string) (string, error)
}

type shopsService struct {
	db *pgxpool.Pool
	q  *shops.Queries
}

func NewShopsService(db *pgxpool.Pool) ShopsService {
	return &shopsService{
		db: db,
		q:  shops.New(db),
	}
}

// ListMsiaStates retrieves a list of Malaysian states from the database.
func (s *shopsService) ListMsiaStates(ctx context.Context) ([]*shops.MsiaState, error) {
	return s.q.ListMsiaStates(ctx)
}

// GetMsiaStateByID retrieves a Malaysian state by its ID from the database.
func (s *shopsService) GetMsiaStateByID(ctx context.Context, id int32) (*shops.MsiaState, error) {
	return s.q.GetMsiaStateByID(ctx, id)
}

// ListShopsView retrieves a list of shop views from the database.
func (s *shopsService) ListShopsView(ctx context.Context) ([]*shops.ShopsView, error) {
	return s.q.ListShopsView(ctx)
}

// GetShopByID retrieves a shop by its ID from the database.
func (s *shopsService) GetShopByID(ctx context.Context, id int32) (*shops.GetShopByIDRow, error) {
	return s.q.GetShopByID(ctx, id)
}

// CreateShop creates a new shop in the database.
func (s *shopsService) CreateShop(ctx context.Context, arg *shops.CreateShopParams) (*shops.Shop, error) {

	return s.q.CreateShop(ctx, arg)
}

// UpdateShop updates an existing shop in the database.
func (s *shopsService) UpdateShop(ctx context.Context, arg *shops.UpdateShopParams) (*shops.Shop, error) {
	return s.q.UpdateShop(ctx, arg)
}

// UpdateShopPassword updates the password hash for a given shop.
func (s *shopsService) UpdateShopPassword(ctx context.Context, shopID int32, newPasswordHash string) (*shops.Shop, error) {
	return s.q.UpdateShopPassword(ctx, &shops.UpdateShopPasswordParams{
		ID:                shopID,
		LoginPasswordHash: newPasswordHash,
	})
}

// GenerateNextBranchCode generates the next branch code for a given state.
// Example: if JH01 exists, returns JH02; if no shops exist for state, returns CODE01
func (s *shopsService) GenerateNextBranchCode(ctx context.Context, stateCode string) (string, error) {
	// Get the current max branch code for this state
	maxCode, err := s.q.GetMaxBranchCodeByStateCode(ctx, stateCode)
	if err != nil {
		// If no shops exist for this state, start with 01
		if err == pgx.ErrNoRows {
			return fmt.Sprintf("%s01", stateCode), nil
		}
		return "", fmt.Errorf("failed to get max branch code: %w", err)
	}

	// Parse the numeric part from the branch code (e.g., "JH01" -> 1)
	numPart := strings.TrimPrefix(maxCode, stateCode)
	currentNum, err := strconv.Atoi(numPart)
	if err != nil {
		return "", fmt.Errorf("failed to parse branch code number: %w", err)
	}

	// Increment and format with leading zeros
	nextNum := currentNum + 1
	return fmt.Sprintf("%s%02d", stateCode, nextNum), nil
}
