package testhelpers

import (
	"context"
	"database/sql"
	"fmt"
	"path/filepath"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

// TestDBContainer wraps a PostgreSQL test container
type TestDBContainer struct {
	Container testcontainers.Container
	Pool      *pgxpool.Pool
	DB        *sql.DB
	Host      string
	Port      string
	Database  string
	Username  string
	Password  string
}

// SetupTestDB creates and starts a PostgreSQL test container
func SetupTestDB(t *testing.T) *TestDBContainer {
	ctx := context.Background()

	// Create PostgreSQL container
	dbContainer, err := postgres.RunContainer(ctx,
		testcontainers.WithImage("postgres:15-alpine"),
		postgres.WithDatabase("testdb"),
		postgres.WithUsername("testuser"),
		postgres.WithPassword("testpass"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2),
		),
	)
	if err != nil {
		t.Fatalf("Failed to start container: %v", err)
	}

	// Get connection details
	host, err := dbContainer.Host(ctx)
	if err != nil {
		t.Fatalf("Failed to get container host: %v", err)
	}

	port, err := dbContainer.MappedPort(ctx, "5432")
	if err != nil {
		t.Fatalf("Failed to get container port: %v", err)
	}

	// Create connection string
	connStr := fmt.Sprintf("postgres://testuser:testpass@%s:%s/testdb?sslmode=disable",
		host, port.Port())

	// Connect with pgxpool
	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		t.Fatalf("Failed to create connection pool: %v", err)
	}

	// Test connection
	if err := pool.Ping(ctx); err != nil {
		t.Fatalf("Failed to ping database: %v", err)
	}

	// Connect with database/sql for migrations
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		t.Fatalf("Failed to open database: %v", err)
	}

	return &TestDBContainer{
		Container: dbContainer,
		Pool:      pool,
		DB:        db,
		Host:      host,
		Port:      port.Port(),
		Database:  "testdb",
		Username:  "testuser",
		Password:  "testpass",
	}
}

// Cleanup closes connections and terminates the container
func (tdb *TestDBContainer) Cleanup(t *testing.T) {
	ctx := context.Background()

	if tdb.Pool != nil {
		tdb.Pool.Close()
	}
	if tdb.DB != nil {
		tdb.DB.Close()
	}
	if tdb.Container != nil {
		if err := tdb.Container.Terminate(ctx); err != nil {
			t.Logf("Failed to terminate container: %v", err)
		}
	}
}

// GetConnectionString returns the database connection string
func (tdb *TestDBContainer) GetConnectionString() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		tdb.Username, tdb.Password, tdb.Host, tdb.Port, tdb.Database)
}

// RunMigrations runs database migrations against the test database
func (tdb *TestDBContainer) RunMigrations(t *testing.T, migrationsPath string) {
	// This is a simple implementation - you might want to use goose or migrate
	// For now, we'll manually run the migration files
	migrationFiles := []string{
		"00001_products.sql",
		"00002_shops.sql", 
		"00003_states.sql",
		"00004_claims.sql",
		"00005_warranties.sql",
	}

	for _, file := range migrationFiles {
		migrationPath := filepath.Join(migrationsPath, file)
		if err := tdb.runMigrationFile(migrationPath); err != nil {
			t.Fatalf("Failed to run migration %s: %v", file, err)
		}
	}
}

func (tdb *TestDBContainer) runMigrationFile(filePath string) error {
	// Note: This is a simplified version. In production, you'd use proper migration tools
	// For this example, we'll create the schema directly
	
	// Create basic schema for testing
	schema := `
		-- Create tables for testing
		CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
		
		-- States table
		CREATE TABLE IF NOT EXISTS states (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(100) NOT NULL UNIQUE,
			code VARCHAR(10) NOT NULL UNIQUE,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		-- Shops table
		CREATE TABLE IF NOT EXISTS shops (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			state_id UUID REFERENCES states(id) ON DELETE CASCADE,
			company_name VARCHAR(255) NOT NULL,
			shop_name VARCHAR(255) NOT NULL,
			address TEXT,
			contact VARCHAR(20),
			email VARCHAR(255),
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		-- Product hierarchy tables
		CREATE TABLE IF NOT EXISTS product_brands (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(100) NOT NULL UNIQUE,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		CREATE TABLE IF NOT EXISTS product_types (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			brand_id UUID REFERENCES product_brands(id) ON DELETE CASCADE,
			name VARCHAR(100) NOT NULL,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		CREATE TABLE IF NOT EXISTS product_series (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			type_id UUID REFERENCES product_types(id) ON DELETE CASCADE,
			name VARCHAR(100) NOT NULL,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		CREATE TABLE IF NOT EXISTS product_names (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			series_id UUID REFERENCES product_series(id) ON DELETE CASCADE,
			name VARCHAR(100) NOT NULL,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		CREATE TABLE IF NOT EXISTS products (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name_id UUID REFERENCES product_names(id) ON DELETE CASCADE,
			sku VARCHAR(100) NOT NULL UNIQUE,
			description TEXT,
			price DECIMAL(10,2),
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		-- Car parts table
		CREATE TABLE IF NOT EXISTS car_parts (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			part_name VARCHAR(255) NOT NULL,
			description TEXT,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		-- Warranties table
		CREATE TABLE IF NOT EXISTS warranties (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			customer_name VARCHAR(255) NOT NULL,
			customer_email VARCHAR(255),
			customer_contact VARCHAR(20),
			car_brand VARCHAR(100),
			car_model VARCHAR(100),
			car_plate_no VARCHAR(20),
			car_chassis_no VARCHAR(50),
			warranty_image_url VARCHAR(500),
			installation_date DATE,
			reference_no VARCHAR(100),
			warranty_no VARCHAR(100) UNIQUE,
			car_part_id UUID REFERENCES car_parts(id),
			allocated_film_quantity INTEGER,
			film_allocated_date DATE,
			shop_id UUID REFERENCES shops(id),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		-- Claims table
		CREATE TABLE IF NOT EXISTS claims (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			warranty_id UUID REFERENCES warranties(id) ON DELETE CASCADE,
			claim_no VARCHAR(100) NOT NULL UNIQUE,
			status VARCHAR(50) NOT NULL,
			claim_date DATE,
			damaged_image_url VARCHAR(500),
			resolution_image_url VARCHAR(500),
			remarks TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		
		-- Create view for claim details
		CREATE OR REPLACE VIEW claim_details AS
		SELECT 
			c.id as claim_id,
			c.claim_no,
			c.status,
			c.claim_date,
			c.damaged_image_url,
			c.resolution_image_url,
			c.remarks,
			c.created_at,
			c.updated_at,
			w.customer_name,
			w.customer_email,
			w.customer_contact,
			w.car_brand,
			w.car_model,
			w.car_plate_no,
			w.car_chassis_no,
			w.warranty_image_url,
			w.installation_date,
			w.reference_no,
			w.warranty_no,
			cp.part_name as car_part_name,
			cp.description as car_part_description,
			w.allocated_film_quantity,
			w.film_allocated_date,
			s.state_id as shop_state,
			s.company_name as shop_company_name,
			s.shop_name,
			s.address as shop_address
		FROM claims c
		JOIN warranties w ON c.warranty_id = w.id
		LEFT JOIN car_parts cp ON w.car_part_id = cp.id
		LEFT JOIN shops s ON w.shop_id = s.id;
	`
	
	_, err := tdb.DB.Exec(schema)
	return err
}

// SeedTestData inserts test data into the database
func (tdb *TestDBContainer) SeedTestData(t *testing.T) {
	seedSQL := `
		-- Insert test states
		INSERT INTO states (id, name, code) VALUES 
		('11111111-1111-1111-1111-111111111111', 'Selangor', 'SEL'),
		('22222222-2222-2222-2222-222222222222', 'Kuala Lumpur', 'KL')
		ON CONFLICT (code) DO NOTHING;
		
		-- Insert test shops
		INSERT INTO shops (id, state_id, company_name, shop_name, address, contact, email) VALUES 
		('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Test Company', 'Test Shop', 'Test Address', '0123456789', 'test@test.com')
		ON CONFLICT (id) DO NOTHING;
		
		-- Insert test car parts
		INSERT INTO car_parts (id, part_name, description) VALUES 
		('44444444-4444-4444-4444-444444444444', 'Front Bumper', 'Front bumper protection film')
		ON CONFLICT (id) DO NOTHING;
		
		-- Insert test warranty
		INSERT INTO warranties (id, customer_name, customer_email, car_brand, car_model, warranty_no, car_part_id, shop_id) VALUES 
		('55555555-5555-5555-5555-555555555555', 'John Doe', 'john@example.com', 'Toyota', 'Camry', 'WTY-001', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333')
		ON CONFLICT (id) DO NOTHING;
	`
	
	if _, err := tdb.DB.Exec(seedSQL); err != nil {
		t.Fatalf("Failed to seed test data: %v", err)
	}
}

// CleanupTestData removes all test data from the database
func (tdb *TestDBContainer) CleanupTestData(t *testing.T) {
	cleanupSQL := `
		DELETE FROM claims;
		DELETE FROM warranties;
		DELETE FROM car_parts;
		DELETE FROM shops;
		DELETE FROM states;
		DELETE FROM products;
		DELETE FROM product_names;
		DELETE FROM product_series;
		DELETE FROM product_types;
		DELETE FROM product_brands;
	`
	
	if _, err := tdb.DB.Exec(cleanupSQL); err != nil {
		t.Logf("Failed to cleanup test data: %v", err)
	}
}