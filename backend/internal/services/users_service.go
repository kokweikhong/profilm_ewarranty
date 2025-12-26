package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/users"
	"github.com/kokweikhong/profilm_ewarranty/backend/pkg/utils"
)

type UsersService interface {
	GetUserByID(ctx context.Context, userID int32) (*users.User, error)
	GetUserByUsername(ctx context.Context, username string) (*users.User, error)
	CreateUser(ctx context.Context, shopID *int32, role, username, password string) (*users.User, error)
	UpdateUserPassword(ctx context.Context, id int32, newPassword string) (*users.User, error)
}

type usersService struct {
	db *pgxpool.Pool
	q  *users.Queries
}

func NewUsersService(db *pgxpool.Pool) UsersService {
	return &usersService{
		db: db,
		q:  users.New(db),
	}
}

// GetUserByID retrieves a user by their ID from the database.
func (s *usersService) GetUserByID(ctx context.Context, userID int32) (*users.User, error) {
	return s.q.GetUserByID(ctx, userID)
}

// GetUserByUsername retrieves a user by their username from the database.
func (s *usersService) GetUserByUsername(ctx context.Context, username string) (*users.User, error) {
	return s.q.GetUserByUsername(ctx, username)
}

// CreateUser creates a new user in the database.
func (s *usersService) CreateUser(ctx context.Context, shopID *int32, role, username, password string) (*users.User, error) {
	passwordHash, err := utils.HashPassword(password)
	if err != nil {
		return nil, err
	}
	params := &users.CreateUserParams{
		ShopID:       shopID,
		Username:     username,
		Role:         role,
		PasswordHash: passwordHash,
	}
	return s.q.CreateUser(ctx, params)
}

// UpdateUserPassword updates a user's password in the database.
func (s *usersService) UpdateUserPassword(ctx context.Context, id int32, newPassword string) (*users.User, error) {
	passwordHash, err := utils.HashPassword(newPassword)
	if err != nil {
		return nil, err
	}

	params := &users.UpdateUserPasswordParams{
		ID:           id,
		PasswordHash: passwordHash,
	}

	return s.q.UpdateUserPassword(ctx, params)
}
