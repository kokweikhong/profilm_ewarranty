# ProFilm E-Warranty Makefile
# Docker Commands Only

.PHONY: help build run stop restart clean logs shell db-shell status images volumes networks clean-containers clean-volumes clean-images setup reset-password adminer-info

# Default target
help: ## Show this help message
	@echo "ProFilm E-Warranty - Docker Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker Commands
build: ## Build all Docker images
	docker-compose build --no-cache

build-api: ## Build only the API Docker image
	docker-compose build --no-cache api

run: ## Start all services in detached mode
	docker-compose up -d

run-logs: ## Start all services with logs visible
	docker-compose up

stop: ## Stop all running services
	docker-compose down

restart: ## Restart all services
	docker-compose down && docker-compose up -d

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all --remove-orphans
	docker system prune -f

# Service Management
start-db: ## Start only the database service
	docker-compose up -d postgres adminer

rebuild-db: ## Rebuild and start only the database service
	docker-compose up -d --build postgres adminer

start-api: ## Start only the API service
	docker-compose up -d api

# Logs and Monitoring
logs: ## Show logs from all services
	docker-compose logs -f

logs-api: ## Show logs from API service only
	docker-compose logs -f api

logs-db: ## Show logs from database service only
	docker-compose logs -f postgres

# Shell Access
shell: ## Open shell in the API container
	docker-compose exec api sh

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U profilm_admin -d profilm_ewarranty

# Docker Utility Commands
status: ## Show status of all containers
	docker-compose ps

images: ## Show Docker images
	docker images | grep profilm

volumes: ## Show Docker volumes
	docker volume ls | grep profilm

networks: ## Show Docker networks
	docker network ls | grep profilm

# Cleanup Commands
clean-containers: ## Remove only containers
	docker-compose down

clean-volumes: ## Remove volumes (WARNING: This will delete all data)
	docker-compose down -v

clean-images: ## Remove built images
	docker-compose down --rmi local

# Setup Commands
setup: ## Quick setup - build and start all services
	@echo "Setting up ProFilm E-Warranty environment..."
	docker-compose build
	docker-compose up -d postgres
	@echo "Waiting for database to start..."
	@sleep 10
	docker-compose up -d api adminer
	@echo "Setup complete! Services should be running."
	@echo "Adminer available at http://localhost:8081"

reset-password: ## Reset environment after password change
	@echo "Resetting environment after password change..."
	docker-compose down -v
	@echo "Cleaning up old volumes..."
	docker-compose build
	docker-compose up -d postgres
	@echo "Waiting for database to initialize with new password..."
	@sleep 15
	docker-compose up -d api adminer
	@echo "Reset complete! New password is active."
	@echo "Adminer available at http://localhost:8081"

adminer-info: ## Show Adminer connection information
	@echo "Adminer Database Connection Info:"
	@echo "=================================="
	@echo "URL: http://localhost:8081"
	@echo "System: PostgreSQL"
	@echo "Server: postgres (NOT localhost!)"
	@echo "Username: profilm_admin"
	@echo "Password: uTVy0o1WZk"
	@echo "Database: profilm_ewarranty"
	@echo "=================================="
