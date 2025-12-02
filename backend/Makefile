.PHONY: help build run test clean migrate-up migrate-down migrate-create migrate-status migrate-reset install-goose sqlc-generate install-sqlc

# Migration configuration
DB_DRIVER ?= postgres
DB_STRING ?= "host=localhost port=5432 user=profilm password="profilm@2025" dbname=profilm_ewarranty sslmode=disable"
MIGRATIONS_DIR = ./migrations

# Show help
help:
	@echo "Available commands:"
	@echo ""
	@echo "  Development:"
	@echo "    make run              - Run the application"
	@echo "    make dev              - Run with hot reload (requires air)"
	@echo "    make build            - Build the application binary"
	@echo ""
	@echo "  Testing:"
	@echo "    make test             - Run all tests"
	@echo "    make test-coverage    - Run tests with coverage report"
	@echo ""
	@echo "  Database Migrations:"
	@echo "    make migrate-create NAME=migration_name  - Create a new migration file"
	@echo "    make migrate-up       - Run all pending migrations"
	@echo "    make migrate-down     - Rollback the last migration"
	@echo "    make migrate-reset    - Rollback all migrations"
	@echo "    make migrate-status   - Check migration status"
	@echo ""
	@echo "  SQLC:"
	@echo "    make sqlc-generate    - Generate Go code from SQL queries"
	@echo ""
	@echo "  Tools Installation:"
	@echo "    make install-goose    - Install goose migration tool"
	@echo "    make install-sqlc     - Install sqlc tool"
	@echo "    make deps             - Install Go dependencies"
	@echo ""
	@echo "  Code Quality:"
	@echo "    make lint             - Run linter"
	@echo "    make clean            - Clean build artifacts"
	@echo ""
	@echo "  Configuration:"
	@echo "    DB_DRIVER=$(DB_DRIVER)"
	@echo "    DB_STRING=$(DB_STRING)"
	@echo "    MIGRATIONS_DIR=$(MIGRATIONS_DIR)"

# Build the application
build:
	go build -o bin/api cmd/api/main.go

# Run the application
run: build
	./bin/api

# Run tests
test:
	go test -v ./...

# Run tests with coverage
test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

# Clean build artifacts
clean:
	rm -rf bin/
	rm -rf build/
	go clean

# Install dependencies
deps:
	go mod download
	go mod tidy

# Run linter
lint:
	golangci-lint run

# Install goose migration tool
install-goose:
	go install github.com/pressly/goose/v3/cmd/goose@latest

# Install sqlc
install-sqlc:
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest

# Generate Go code from SQL queries using sqlc
sqlc-generate:
	sqlc generate

# Create a new migration file (SQL format)
# Usage: make migrate-create NAME=create_users_table
migrate-create:
	goose -dir $(MIGRATIONS_DIR) create $(NAME) sql

# Run all available migrations
migrate-up:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_STRING) up

# Rollback the last migration
migrate-down:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_STRING) down

# Rollback all migrations
migrate-reset:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_STRING) reset

# Check migration status
migrate-status:
	goose -dir $(MIGRATIONS_DIR) $(DB_DRIVER) $(DB_STRING) status

# Hot reload (requires air: go install github.com/cosmtrek/air@latest)
dev:
	air
