# ProFilm eWarranty API Documentation

This directory contains the Swagger/OpenAPI documentation for the ProFilm eWarranty API.

## Quick Start

### 1. Start the Documentation Server

```bash
make swagger-test
```

### 2. Access Documentation

- **Swagger UI**: http://localhost:8080/docs
- **API Specification**: http://localhost:8080/swagger.yaml
- **Health Check**: http://localhost:8080/health

## API Overview

The ProFilm eWarranty API provides comprehensive functionality for:

- **Product Management**: Brands, types, series, names, and warranty years
- **Shop Management**: Shop registration, details, and state management
- **Warranty Management**: Warranty creation and management
- **Claims Management**: Warranty claim processing and tracking
- **Product Allocations**: Managing product distribution to shops

## API Structure

### Base URLs

- Development: `http://localhost:8080`
- Production: TBD

### Authentication

Currently using API Key authentication (header: `Authorization`)

### Response Formats

All API endpoints return JSON responses with consistent error handling:

```json
// Success Response
{
  "id": "uuid",
  "name": "Product Name",
  "created_at": "2025-11-02T10:30:00Z"
}

// Error Response
{
  "error": "Error message description",
  "code": 400
}
```

## Available Endpoints

### Products

- `POST /products/brands` - Create product brand
- `GET /products/brands` - List product brands
- `GET /products/brands/{id}` - Get brand by ID
- `PUT /products/brands/{id}` - Update brand
- `DELETE /products/brands/{id}` - Delete brand

### Product Types

- `POST /products/types` - Create product type
- `GET /products/types` - List product types
- `GET /products/types/{id}` - Get type by ID
- `PUT /products/types/{id}` - Update type
- `DELETE /products/types/{id}` - Delete type

### Products

- `POST /products` - Create product
- `GET /products` - List products
- `GET /products/{id}` - Get product by ID
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Shops

- `POST /shops` - Create shop
- `GET /shops` - List shops
- `GET /shops/{id}` - Get shop by ID
- `PUT /shops/{id}` - Update shop
- `DELETE /shops/{id}` - Delete shop

### Claims

- `POST /claims` - Create warranty claim
- `GET /claims` - List claims
- `GET /claims/{id}` - Get claim by ID
- `PUT /claims/{id}` - Update claim
- `DELETE /claims/{id}` - Delete claim

## Development

### Files Structure

```
├── swagger.yaml           # Main API specification
├── cmd/swagger-test/      # Test server for documentation
├── internal/api/handlers/ # API handlers with swagger_handler.go
└── docs/                  # This documentation
```

### Making Changes

1. **Update API Specification**: Edit `swagger.yaml`
2. **Test Changes**: Run `make swagger-test`
3. **View Documentation**: Open http://localhost:8080/docs

### Validation

The API specification follows OpenAPI 2.0 (Swagger 2.0) format.

## Integration

### Full API Server

To run the complete API server with database connectivity:

```bash
make run
```

### Database Requirements

The full API requires PostgreSQL with the following setup:

- Run migrations: `make goose-up`
- Seed data: `make seed-all`
- Generate dummy data: `make dummy-all`

## Production Deployment

When deploying to production:

1. Update `host` and `schemes` in `swagger.yaml`
2. Configure proper authentication
3. Set up CORS appropriately
4. Use environment variables for sensitive configuration

## Support

For issues with the API documentation or endpoints, please check:

- API logs for error details
- Database connectivity
- Required seed data is present

## Version History

- **v1.0.0**: Initial API documentation with comprehensive endpoint coverage
