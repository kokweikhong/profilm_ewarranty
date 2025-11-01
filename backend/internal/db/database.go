package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	Pool *pgxpool.Pool
}

func NewDB(databaseURL string) (*Database, error) {
	pool, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return &Database{
		Pool: pool,
	}, nil
}

func (db *Database) Close() {
	db.Pool.Close()
}
