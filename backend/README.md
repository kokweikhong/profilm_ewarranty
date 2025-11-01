# Profilm E-Warranty Backend API

A Go-based REST API for managing electronic warranties with SQLC for type-safe database operations.

## Project Structure

```
.
├── cmd/
│   └── api/                    # Application entry points
├── internal/
│   ├── config/                 # Configuration management
│   ├── database/               # Database connection and SQLC generated code
│   │   └── sqlc/              # Generated SQLC code
│   ├── handlers/               # HTTP handlers
│   ├── middleware/             # HTTP middleware
│   ├── models/                 # Business models
│   ├── repository/             # Data access layer
│   └── services/               # Business logic
├── sql/
│   ├── queries/                # SQL queries for SQLC
│   └── schema/                 # Database schema
├── migrations/                 # Database migrations
├── api/
│   └── v1/                     # API versioning
├── pkg/
│   └── utils/                  # Shared utilities
├── configs/                    # Configuration files
├── docs/                       # Documentation
├── scripts/                    # Build and deployment scripts
├── sqlc.yaml                   # SQLC configuration
├── docker-compose.yml          # Docker Compose setup
├── Dockerfile                  # Docker image definition
└── .env.example               # Environment variables template
```

## Features

- **SQLC Integration**: Type-safe database operations
- **Database Migrations**: Using Goose for schema management
- **JWT Authentication**: Secure API endpoints
- **CORS Support**: Cross-origin resource sharing
- **Health Checks**: API health monitoring
- **Docker Support**: Containerized deployment
- **PostgreSQL**: Robust database backend

## Quick Start

### Prerequisites

- Go 1.21 or higher
- PostgreSQL
- SQLC
- Goose (for migrations)

### Setup

1. **Clone and navigate to the project:**

   ```bash
   cd d:\projects\profilm_ewarranty\backend
   ```

2. **Install dependencies:**

   ```bash
   go mod tidy
   ```

3. **Install tools (Windows):**

   ```cmd
   scripts\setup.bat
   ```

   **Or on Unix/Linux:**

   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

4. **Setup environment:**

   ```bash
   copy .env.example .env
   # Edit .env with your database credentials
   ```

5. **Start PostgreSQL and run migrations:**

   ```cmd
   # Update database URL in scripts\migrate.bat first
   scripts\migrate.bat
   ```

6. **Generate SQLC code:**

   ```bash
   sqlc generate
   ```

7. **Run the application:**
   ```bash
   go run cmd/api/main.go
   ```

### Using Docker

1. **Start with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

This will start both PostgreSQL and the API server.

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Users

- `POST /users` - Create a new user
- `GET /users?id={id}` - Get user by ID

### Products

- `POST /products` - Create a new product
- `GET /products?id={id}` - Get product by ID

### Warranties

- `POST /warranties` - Create a new warranty
- `GET /warranties?id={id}` - Get warranty by ID

## Database Schema

The project includes three main entities:

1. **Users** - User accounts and authentication
2. **Products** - Product catalog with warranty information
3. **Warranties** - Individual warranty records linking users to products

## Development

### Adding New Queries

1. Add SQL queries to files in `sql/queries/`
2. Run `sqlc generate` to generate Go code
3. Use the generated code in your handlers

### Adding Migrations

1. Create new migration file in `migrations/` following the naming pattern
2. Run migrations using `goose` command

### Project Guidelines

- Follow Go best practices and conventions
- Use SQLC for all database operations
- Implement proper error handling
- Add middleware for cross-cutting concerns
- Keep handlers thin, business logic in services

## Environment Variables

| Variable       | Description                  | Default       |
| -------------- | ---------------------------- | ------------- |
| `PORT`         | Server port                  | `8080`        |
| `DATABASE_URL` | PostgreSQL connection string | -             |
| `JWT_SECRET`   | JWT signing secret           | -             |
| `ENVIRONMENT`  | Runtime environment          | `development` |

## Contributing

1. Follow Go coding standards
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

[Add your license information here]
