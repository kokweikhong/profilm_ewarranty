# ProFilm E-Warranty Backend API

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
- PostgreSQL/MySQL (or your preferred database)

### Installation

```bash
go mod download
```

### Running the Application

```bash
go run cmd/api/main.go
```

### Running Tests

```bash
go test ./...
```

## Development

### Environment Variables

Create a `.env` file in the root directory with the necessary environment variables.

## License

Proprietary
