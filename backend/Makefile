
# Database variables
MIGRATIONS_DIR=./migrations
DB_URL=postgresql://profilm_admin:uTVy0o1WZk@localhost:5432/profilm_ewarranty?sslmode=disable
DB_URL_DOCKER=postgresql://profilm_admin:uTVy0o1WZk@postgres:5432/profilm_ewarranty?sslmode=disable

# Test commands
test:
	go test -v ./...

build:
	go build -o bin/api.exe ./cmd/api/main.go

run: build
	./bin/api.exe

test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

# Database commands
goose-create:
	goose -dir $(MIGRATIONS_DIR) create $(name) -s sql

goose-up:
	goose -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" up

goose-down:
	goose -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" down

goose-reset:
	goose -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" reset

goose-reset-confirm:
	@echo "⚠️  WARNING: This will DROP ALL TABLES and data!"
	@echo "Are you sure? Type 'YES' to continue:"
	@read CONFIRM && [ "$$CONFIRM" = "YES" ] && $(MAKE) goose-reset || echo "Operation cancelled"

seed:
	go run ./cmd/seed/main.go

seed-states:
	go run ./cmd/seed/main.go -states

seed-clear:
	go run ./cmd/seed/main.go -clear

goose-status:
	goose -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" status

goose-reset:
	goose -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" reset

# SQLC commands
sqlc-generate:
	sqlc generate

# Go mod commands
mod-tidy:
	go mod tidy

mod-download:
	go mod download

# Linting and formatting
fmt:
	go fmt ./...

vet:
	go vet ./...

# Setup development environment
setup: mod-tidy sqlc-generate
	@echo "Development environment setup complete!"

# Docker commands
docker-build:
	docker build -t profilm-ewarranty-api .

docker-run: docker-build
	docker run -p 8080:8080 profilm-ewarranty-api

docker-compose-up:
	docker-compose up -d

docker-compose-down:
	docker-compose down

docker-compose-logs:
	docker-compose logs -f

# Help command
help:
	@echo "Available commands:"
	@echo "  build          - Build the application"
	@echo "  run            - Build and run the application"
	@echo "  dev            - Run in development mode"
	@echo "  clean          - Clean build artifacts"
	@echo "  test           - Run tests"
	@echo "  test-coverage  - Run tests with coverage"
	@echo "  fmt            - Format Go code"
	@echo "  vet            - Run go vet"
	@echo "  setup          - Setup development environment"
	@echo ""
	@echo "Database commands:"
	@echo "  goose-create name=<name>  - Create new migration"
	@echo "  goose-up                  - Run all migrations"
	@echo "  goose-down                - Rollback last migration"
	@echo "  goose-status              - Show migration status"
	@echo "  goose-reset               - Reset all migrations"
	@echo "  sqlc-generate             - Generate SQLC code"
	@echo ""
	@echo "Docker commands:"
	@echo "  docker-build              - Build Docker image"
	@echo "  docker-run                - Run Docker container"
	@echo "  docker-compose-up         - Start with docker-compose"
	@echo "  docker-compose-down       - Stop docker-compose"
	@echo "  docker-compose-logs       - View docker-compose logs"

.PHONY: build run dev clean test test-coverage fmt vet setup help prepare
.PHONY: goose-create goose-up goose-down goose-status goose-reset sqlc-generate
.PHONY: docker-build docker-run docker-compose-up docker-compose-down docker-compose-logs
.PHONY: mod-tidy mod-download