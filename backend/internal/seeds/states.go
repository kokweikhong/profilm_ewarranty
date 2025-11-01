package seeds

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

// StateSeeder handles seeding of states data
type StateSeeder struct {
	db *pgxpool.Pool
}

// NewStateSeeder creates a new state seeder
func NewStateSeeder(db *pgxpool.Pool) *StateSeeder {
	return &StateSeeder{db: db}
}

// Seed inserts Malaysian states into the database
func (s *StateSeeder) Seed(ctx context.Context) error {
	log.Println("🌏 Seeding Malaysian states...")

	states := []string{
		"Johor",
		"Kedah",
		"Kelantan",
		"Kuala Lumpur",
		"Labuan",
		"Malacca",
		"Negeri Sembilan",
		"Pahang",
		"Penang",
		"Perak",
		"Perlis",
		"Putrajaya",
		"Sabah",
		"Sarawak",
		"Selangor",
		"Terengganu",
	}

	// Check if states already exist
	var existingCount int
	countQuery := `SELECT COUNT(*) FROM states WHERE name = ANY($1)`
	err := s.db.QueryRow(ctx, countQuery, states).Scan(&existingCount)
	if err != nil {
		return fmt.Errorf("failed to check existing states: %w", err)
	}

	if existingCount > 0 {
		log.Printf("ℹ️  Found %d existing states, skipping seed", existingCount)
		return nil
	}

	// Insert states using batch
	query := `
		INSERT INTO states (name) 
		VALUES ($1) 
		ON CONFLICT (name) DO NOTHING
	`

	insertedCount := 0
	for _, state := range states {
		result, err := s.db.Exec(ctx, query, state)
		if err != nil {
			return fmt.Errorf("failed to insert state %s: %w", state, err)
		}
		
		if result.RowsAffected() > 0 {
			insertedCount++
		}
	}

	log.Printf("✅ Successfully seeded %d states", insertedCount)
	return nil
}

// Clear removes all states (use with caution)
func (s *StateSeeder) Clear(ctx context.Context) error {
	log.Println("🗑️  Clearing states data...")

	query := `DELETE FROM states`
	result, err := s.db.Exec(ctx, query)
	if err != nil {
		return fmt.Errorf("failed to clear states: %w", err)
	}

	log.Printf("🧹 Cleared %d states", result.RowsAffected())
	return nil
}

// Exists checks if any states exist in the database
func (s *StateSeeder) Exists(ctx context.Context) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM states`
	err := s.db.QueryRow(ctx, query).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check states existence: %w", err)
	}
	return count > 0, nil
}

// Legacy functions for backward compatibility
func SeedStates(db *pgxpool.Pool) error {
	seeder := NewStateSeeder(db)
	return seeder.Seed(context.Background())
}

// SeedAll runs all seed functions
func SeedAll(db *pgxpool.Pool) error {
	ctx := context.Background()
	
	// Seed states
	stateSeeder := NewStateSeeder(db)
	if err := stateSeeder.Seed(ctx); err != nil {
		return fmt.Errorf("failed to seed states: %w", err)
	}
	
	// Add other seeders here
	// productSeeder := NewProductSeeder(db)
	// if err := productSeeder.Seed(ctx); err != nil {
	// 	return fmt.Errorf("failed to seed products: %w", err)
	// }

	log.Println("🎉 All seeds completed successfully!")
	return nil
}