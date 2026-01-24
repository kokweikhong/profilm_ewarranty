# Profilm E-Warranty Backend API

## Project Structure

```
.
├── cmd/                    # Application entry points
│   └── api/               # Main API application
├── internal/              # Private application code
│   ├── handler/           # HTTP handlers (controllers)
│   ├── service/           # Business logic layer
│   ├── repository/        # Data access layer
│   ├── model/             # Domain models
│   ├── middleware/        # HTTP middlewares
│   └── validator/         # Input validation
├── pkg/                   # Public libraries (can be imported by external apps)
│   ├── config/            # Configuration management
│   ├── database/          # Database connection and setup
│   ├── logger/            # Logging utilities
│   └── utils/             # Common utilities
├── api/                   # API definitions
│   ├── proto/             # Protocol buffer files (gRPC)
│   └── swagger/           # OpenAPI/Swagger specs
├── configs/               # Configuration files
├── migrations/            # Database migrations
├── scripts/               # Build and utility scripts
├── tests/                 # Test files
│   ├── integration/       # Integration tests
│   └── unit/              # Unit tests
├── docs/                  # Documentation
├── build/                 # Build artifacts
└── deployments/           # Deployment configurations (Docker, K8s, etc.)
```

## Getting Started

### Prerequisites

- Go 1.21 or higher
- PostgreSQL database
- goose (migration tool)
- sqlc (SQL code generator)

### Installation

```bash
# Install dependencies
make deps

# Install required tools
make install-goose
make install-sqlc
```

### Database Setup

```bash
# Run migrations
make migrate-up

# Check migration status
make migrate-status
```

### Create Admin User

Create an admin user for accessing the system:

```bash
make create-admin
```

This will create an admin user with:

- **Username**: `admin`
- **Password**: `admin@profilm`
- **Shop ID**: `null` (super admin)

⚠️ **Important**: Change the default password after first login in production!

See [cmd/create-admin/README.md](cmd/create-admin/README.md) for more details.

### Running the Application

```bash
# Run with make
make run

# Or build and run directly
make build
./bin/api

# Or run with hot reload (requires air)
make dev
```

### Database Seeding

```bash
# Seed with sample data (100 records)
make seed

# Clean database and seed
make seed-clean

# Seed with maximum data (150 records)
make seed-max
```

### Running Tests

```bash
# Run all tests
make test

# Run tests with coverage
make test-coverage
```

## Available Make Commands

Run `make help` to see all available commands:

```bash
make help
```

Key commands:

- `make run` - Run the application
- `make build` - Build the application binary
- `make test` - Run all tests
- `make migrate-up` - Run database migrations
- `make create-admin` - Create admin user
- `make seed` - Seed database with sample data
- `make sqlc-generate` - Generate Go code from SQL queries

## Development

### Environment Variables

Create a `.env` file in the root directory or set environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=profilm
DB_PASSWORD=profilm@2025
DB_NAME=profilm_ewarranty
DB_SSL_MODE=disable

JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

PORT=8080
```

### Project Structure

## License

Proprietary
