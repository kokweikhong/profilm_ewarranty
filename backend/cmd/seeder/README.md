# Database Seeder

This seeder CLI program populates the database with realistic test data for development and testing purposes.

## Features

- Seeds 100-150 records for:

  - Products (with existing brands, types, series, names)
  - Shops (20 shops across Malaysian states)
  - Product Allocations
  - Warranties (with realistic customer and car data)
  - Claims (approximately 1/3 of warranties)

- Generates realistic Malaysian data:
  - Malaysian car brands and models (Toyota, Proton, Perodua, etc.)
  - Malaysian states and branch codes
  - Malaysian phone numbers and car plate numbers
  - Malaysian names and addresses

## Usage

### Using Makefile (Recommended)

```bash
# Seed 100 records (keep existing data)
make seed

# Clean existing data and seed 100 records
make seed-clean

# Clean and seed maximum 150 records
make seed-max
```

### Direct Command

```bash
# Seed 100 records
go run cmd/seeder/main.go -count=100

# Clean existing data before seeding
go run cmd/seeder/main.go -count=100 -clean

# Seed 150 records with clean
go run cmd/seeder/main.go -count=150 -clean
```

## Flags

- `-count` - Number of records to seed (100-150, default: 100)
- `-clean` - Clean existing data before seeding (default: false)

## Prerequisites

Make sure you have:

1. Database migrations run (`make migrate-up`)
2. Reference data populated (product brands, types, series, names, warranty periods, states)
3. Valid database connection in `.env` file

## Generated Data

### Products

- Uses existing product brands, types, series, and names from migrations
- Random film serial numbers, quantities, and shipment numbers
- 90% marked as active

### Shops

- 20 shops distributed across Malaysian states
- Auto-generated branch codes (e.g., JH01, SG02)
- Realistic Malaysian addresses and contact info
- 95% marked as active

### Product Allocations

- Random allocation of products to shops
- Dates within the last year
- Film quantities between 10-60 units

### Warranties

- Realistic Malaysian car data:
  - Popular brands: Toyota, Honda, Proton, Perodua, etc.
  - Actual car models per brand
  - Malaysian car plate number format (e.g., WKL1234)
  - 17-character chassis numbers
- Realistic customer data:
  - Malaysian, Chinese, Indian, and Western names
  - Valid phone numbers (01X-XXXXXXX format)
  - Email addresses with common domains
- Installation dates within last 6 months
- Car parts: Full Body, Windscreen, Windows, Hood, etc.

### Claims

- Approximately 1/3 of warranties have claims
- Various statuses: Pending, Approved, Rejected, In Progress, Completed
- Claim dates 30-120 days after installation
- Linked to specific warranties and products

## Database Impact

⚠️ **Warning**: Using `-clean` flag will **DELETE ALL DATA** from:

- claims
- warranties
- product_allocations
- products
- shops

Reference data (brands, types, series, names, warranty periods, states) is preserved.

## Example Output

```
Connected to database successfully
Loading reference data...
Loaded 7 warranty periods and 15 states
Seeding 100 products...
Created 100 products
Seeding 20 shops...
Created 20 shops
Seeding 100 product allocations...
Created 100 product allocations
Seeding 100 warranties...
Created 100 warranties
Seeding approximately 33 claims...
Created 33 claims
Seeding completed successfully!
Created:
  - 100 Products
  - 20 Shops
  - 100 Product Allocations
  - 100 Warranties
  - Approximately 33 Claims
```

## Troubleshooting

### "Failed to connect to database"

- Check your `.env` file has correct database credentials
- Ensure PostgreSQL is running
- Verify database exists

### "Missing reference data for products"

- Run migrations: `make migrate-up`
- Ensure the insert migrations for product brands, types, series, names are executed

### "Failed to load warranty periods"

- Ensure warranty_periods table is populated
- Check the insert migrations have run

### "Count must be between 100 and 150"

- Use `-count` flag with value between 100-150

## Development

To modify the seeder:

1. Edit `cmd/seeder/main.go`
2. Add new data generators as needed
3. Update the seeding functions for your requirements

## Notes

- The seeder uses random data generation with realistic Malaysian context
- Each run generates different data (random names, dates, quantities, etc.)
- Car plate numbers follow Malaysian format: [State][Letters][Numbers]
- Branch codes follow pattern: [State Code][2-digit number]
- All dates are generated relative to current date for realistic test scenarios
