package services

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/users"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type ShopsService interface {
	ListMsiaStates(ctx context.Context) ([]*shops.MsiaState, error)
	GetMsiaStateByID(ctx context.Context, id int32) (*shops.MsiaState, error)
	GetShops(ctx context.Context) ([]*shops.GetShopsRow, error)
	GetShopByID(ctx context.Context, id int32) (*shops.Shop, error)
	CreateShop(ctx context.Context, arg *shops.CreateShopParams) (*shops.Shop, error)
	UpdateShop(ctx context.Context, arg *shops.UpdateShopParams) (*shops.Shop, error)
	GenerateNextBranchCode(ctx context.Context, stateCode string) (string, error)
}

type shopsService struct {
	db     *pgxpool.Pool
	q      *shops.Queries
	usersQ *users.Queries
}

func NewShopsService(db *pgxpool.Pool) ShopsService {
	return &shopsService{
		db:     db,
		q:      shops.New(db),
		usersQ: users.New(db),
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

// GetShops retrieves a list of shops from the database.
func (s *shopsService) GetShops(ctx context.Context) ([]*shops.GetShopsRow, error) {
	return s.q.GetShops(ctx)
}

// GetShopByID retrieves a shop by its ID from the database.
func (s *shopsService) GetShopByID(ctx context.Context, id int32) (*shops.Shop, error) {
	return s.q.GetShopByID(ctx, id)
}

// CreateShop creates a new shop in the database and automatically creates a user with default password.
func (s *shopsService) CreateShop(ctx context.Context, arg *shops.CreateShopParams) (*shops.Shop, error) {
	// Create the shop
	shop, err := s.q.CreateShop(ctx, arg)
	if err != nil {
		return nil, fmt.Errorf("failed to create shop: %w", err)
	}

	// Hash the default password
	defaultPassword := "password@profilm"

	// Create username from shop name (lowercase, replace spaces with underscores)
	username := strings.ToLower(shop.BranchCode)

	hashPassword, err := utils.HashPassword(defaultPassword)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Create user for the shop with default password
	userParams := &users.CreateUserParams{
		ShopID:       &shop.ID,
		Username:     username,
		Role:         "shop_admin",
		PasswordHash: hashPassword,
	}

	_, err = s.usersQ.CreateUser(ctx, userParams)
	if err != nil {
		// Log the error but don't fail the shop creation
		// You might want to handle this differently in production
		fmt.Printf("Warning: Failed to create user for shop %d: %v\n", shop.ID, err)
	}

	return shop, nil
}

// UpdateShop updates an existing shop in the database.
func (s *shopsService) UpdateShop(ctx context.Context, arg *shops.UpdateShopParams) (*shops.Shop, error) {
	return s.q.UpdateShop(ctx, arg)
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
