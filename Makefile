.PHONY: help build up down restart logs clean clean-all prune ps shell-backend shell-frontend shell-db adminer migrate-up migrate-down dev-backend dev-frontend up-db up-backend up-frontend up-nginx down-db down-backend down-frontend down-nginx restart-db restart-backend restart-frontend restart-nginx rebuild rebuild-backend rebuild-frontend logs-nginx

# Default target
help:
	@echo "Available commands:"
	@echo "  make build          - Build all Docker images"
	@echo "  make up             - Start all services"
	@echo "  make up-db          - Start database and Adminer"
	@echo "  make up-backend     - Start backend service only"
	@echo "  make up-frontend    - Start frontend service only"
	@echo "  make up-nginx       - Start nginx service only"
	@echo "  make down           - Stop all services"
	@echo "  make down-db        - Stop database and Adminer"
	@echo "  make down-backend   - Stop backend service only"
	@echo "  make down-frontend  - Stop frontend service only"
	@echo "  make down-nginx     - Stop nginx service only"
	@echo "  make restart        - Restart all services"
	@echo "  make restart-db     - Restart database and Adminer"
	@echo "  make restart-backend - Restart backend service only"
	@echo "  make restart-frontend - Restart frontend service only"
	@echo "  make restart-nginx  - Restart nginx service only"
	@echo "  make logs           - View logs from all services"
	@echo "  make logs-backend   - View backend logs"
	@echo "  make logs-frontend  - View frontend logs"
	@echo "  make logs-db        - View database logs"
	@echo "  make ps             - List running containers"
	@echo "  make clean          - Stop and remove containers, networks, and volumes"
	@echo "  make clean-all      - Remove everything including images and orphans"
	@echo "  make prune          - Remove all unused Docker resources (system-wide)"
	@echo "  make shell-backend  - Access backend container shell"
	@echo "  make shell-frontend - Access frontend container shell"
	@echo "  make shell-db       - Access PostgreSQL shell"
	@echo "  make adminer        - Open Adminer in browser"
	@echo "  make dev-backend    - Run backend in development mode"
	@echo "  make dev-frontend   - Run frontend in development mode"
	@echo "  make rebuild        - Rebuild and restart all services"
	@echo "  make rebuild-backend - Rebuild and restart backend only"
	@echo "  make rebuild-frontend - Rebuild and restart frontend only"

# Build all Docker images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Start individual services
up-db:
	docker-compose up -d postgres adminer

up-backend:
	docker-compose up -d backend

up-frontend:
	docker-compose up -d frontend

up-nginx:
	docker-compose up -d nginx

# Stop all services
down:
	docker-compose down

# Stop individual services
down-db:
	docker-compose stop postgres adminer

down-backend:
	docker-compose stop backend

down-frontend:
	docker-compose stop frontend

down-nginx:
	docker-compose stop nginx

# Restart all services
# Restart individual services
restart-db:
	docker-compose restart postgres adminer

restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

restart-nginx:
	docker-compose restart nginx

restart-frontend:
	docker-compose restart frontend

# View logs from all services
logs:
	docker-compose logs -f

# View backend logs
logs-backend:
	docker-compose logs -f backend

# View frontend logs
# View database logs
logs-db:
	docker-compose logs -f postgres

# View nginx logs
logs-nginx:
	docker-compose logs -f nginx

# List running containers
	docker-compose logs -f postgres

# List running containers
ps:
	docker-compose ps

# Stop and remove containers, networks, and volumes
clean:
	docker-compose down -v --remove-orphans

# Remove everything including images
clean-all:
	docker-compose down -v --rmi all --remove-orphans

# Prune all unused Docker resources (system-wide)
prune:
	docker system prune -a --volumes -f

# Access backend container shell
shell-backend:
	docker-compose exec backend sh

# Access frontend container shell
shell-frontend:
	docker-compose exec frontend sh

# Access PostgreSQL shell
shell-db:
	docker-compose exec postgres psql -U profilm -d profilm_ewarranty

# Open Adminer in browser (Windows)
adminer:
	@echo Opening Adminer at http://localhost:8081
	@start http://localhost:8081

# Rebuild and restart all services
rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Rebuild and restart backend only
rebuild-backend:
	docker-compose stop backend
	docker-compose build --no-cache backend
	docker-compose up -d backend

# Rebuild and restart frontend only
rebuild-frontend:
	docker-compose stop frontend
	docker-compose build --no-cache frontend
	docker-compose up -d frontend

# Run backend in development mode (local, not Docker)
dev-backend:
	cd backend && go run cmd/api/main.go

# Run frontend in development mode (local, not Docker)
dev-frontend:
	cd frontend && npm run dev
