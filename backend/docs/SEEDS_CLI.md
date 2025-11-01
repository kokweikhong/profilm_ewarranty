# Seeds CLI Tool

The Seeds CLI tool is designed to populate the database with initial data for development, testing, and production environments.

## Usage

### Direct Command

```bash
# Build the seeds tool
go build -o bin/seeds.exe ./cmd/seeds

# Run specific seed type
./bin/seeds.exe -type product-brands
./bin/seeds.exe -type all

# Show help
./bin/seeds.exe -help
```

### Using Makefile

```bash
# Show all available commands
make help

# Show seeds-specific help
make seeds-help

# Seed product brands only
make seed-product-brands

# Seed product types only
make seed-product-types

# Seed product series only
make seed-product-series

# Seed product names only
make seed-product-names

# Seed warranty years only
make seed-warranty-years

# Seed Malaysian states only
make seed-states

# Seed all data types
make seed-all
```

## Available Seed Types

### `product-brands`

Seeds product brands data including:

- **Profilm** - Main product brand

The seeder will:

- Check for existing brands to avoid duplicates
- Skip existing brands with a message
- Create new brands and show success confirmation
- Display the created brand name and UUID

### `product-types`

Seeds product types under the Profilm brand including:

- **Window Tinting Film** - Window protection film products
- **Paint Protection Film** - Vehicle paint protection products

The seeder will:

- Find the Profilm brand (must exist first)
- Check for existing product types under the brand to avoid duplicates
- Skip existing types with a message
- Create new product types and show success confirmation
- Display the created type name, UUID, and associated brand

**Prerequisites:** Run `product-brands` seed first, or use `seed-all` for proper dependency order.

### `product-series`

Seeds product series under existing product types including:

**Window Tinting Film series:**

- **Tint Value Series** - Entry-level window tinting products
- **Tint Skincare Series** - Mid-range with health benefits
- **Tint Premium Series** - High-quality window films
- **Tint Flagship Series** - Top-tier window tinting products

**Paint Protection Film series:**

- **Protection Clear Series** - Transparent paint protection
- **Protection ProColor Series** - Colored protection films
- **Protection Flagship Series** - Premium paint protection

The seeder will:

- Find existing Window Tinting Film and Paint Protection Film product types
- Check for existing product series under each type to avoid duplicates
- Skip existing series with a message
- Create new product series and show success confirmation
- Display the created series name, UUID, and associated product type

**Prerequisites:** Run `product-brands` and `product-types` seeds first, or use `seed-all` for proper dependency order.

### `product-names`

Seeds comprehensive product names catalog under existing product series including:

**Window Tinting Film - Tint Value Series:**

- **ICE Series:** ICE80, ICE50, ICE35, ICE15, ICE5 (ceramic infrared rejection films)
- **LUX Series:** LUX50, LUX35, LUX15, LUX5 (luxury tinting films)
- **Specialty:** Q70, S76 (performance specialty films)

**Window Tinting Film - Tint Skincare Series:**

- **UM Series:** UM70, UM30, UM18 (UV protection with health benefits)

**Window Tinting Film - Tint Premium Series:**

- **Y Series:** Y70 (premium clarity films)
- **S Series:** S35, S20 (superior heat rejection)
- **V Series:** V35, V20 (advanced visibility films)

**Window Tinting Film - Tint Flagship Series:**

- **K70** (top-tier flagship product)

**Paint Protection Film - Protection Clear Series:**

- **Hydro Protect** (hydrophobic protection)
- **P10** (entry-level clear protection)
- **reGen** (self-healing technology)
- **Ultra Clear Pro** (premium clear protection)

**Paint Protection Film - Protection ProColor Series:**

- **Diamond Collection:** Blue Diamond, Gold Diamond, Red Diamond, Silver Diamond
- **Specialty Colors:** Gold Shine, Green Chameleon, Moon Shine, Rose Chameleon

**Paint Protection Film - Protection Flagship Series:**

- **Ultra Clear Pro X** (ultimate protection technology)

The seeder will:

- Find existing product series by name across all product types
- Check for existing product names under each series to avoid duplicates
- Skip existing names with detailed logging per series
- Create new product names and show success confirmation
- Display the created name, UUID, and associated series

**Prerequisites:** Run `product-brands`, `product-types`, and `product-series` seeds first, or use `seed-all` for proper dependency order.

### `warranty-years`

Seeds warranty years data including:

- **5 years** - Standard warranty period
- **7 years** - Extended warranty option
- **10 years** - Premium warranty period
- **12 years** - Maximum warranty coverage

The seeder will:

- Check for existing warranty years to avoid duplicates
- Skip existing years with a message
- Create new warranty years and show success confirmation
- Display the created year value and UUID

**Prerequisites:** None (independent seed type).

### `states`

Seeds comprehensive Malaysian states and federal territories including:

**States:**

- **Johor** - Southern state
- **Kedah** - Northwestern state
- **Kelantan** - Northeastern state
- **Malacca (Melaka)** - Historical state
- **Negeri Sembilan** - Central state
- **Pahang** - Largest state by area
- **Penang (Pulau Pinang)** - Island state
- **Perak** - Western state
- **Perlis** - Smallest state
- **Sabah** - East Malaysian state
- **Sarawak** - Largest state by area
- **Selangor** - Most populous state
- **Terengganu** - East coast state

**Federal Territories:**

- **Kuala Lumpur** - Federal capital
- **Labuan** - Federal territory island
- **Putrajaya** - Administrative capital

The seeder will:

- Check for existing states to avoid duplicates
- Skip existing states with detailed logging
- Create new states and show success confirmation
- Display the created state name and UUID

**Prerequisites:** None (independent seed type).

### `all`

Runs all available seed types in the correct dependency order:

1. Product brands (foundation data)
2. Product types (depends on brands)
3. Product series (depends on product types)
4. Product names (depends on product series)
5. Warranty years (independent)
6. States (independent)
7. Additional seed types (as they're added)

## Architecture

### Command Structure

- `cmd/seeds/main.go` - CLI entry point with flag parsing and help
- `internal/seeds/seeder.go` - Core seeding logic and database operations

### Extensibility

The seeder is designed to be easily extensible:

1. **Add new seed types** to the `main.go` switch statement
2. **Implement new seed methods** in `seeder.go`
3. **Update help text** to document new seed types
4. **Add Makefile targets** for convenience

### Example: Adding New Seed Type

```go
// In cmd/seeds/main.go
case "product-names":
    if err := seeder.SeedProductNames(ctx); err != nil {
        log.Fatal("Failed to seed product names:", err)
    }
    fmt.Println("✅ Product names seeded successfully")

// In internal/seeds/seeder.go
func (s *Seeder) SeedProductNames(ctx context.Context) error {
    // Implementation with series lookup, dependency checking and name creation
    return nil
}
```

## Features

- **Duplicate Prevention**: Checks existing data before creating new records
- **Progress Feedback**: Clear console output with emojis and status messages
- **Error Handling**: Comprehensive error handling with descriptive messages
- **Flexible Architecture**: Easy to extend with new seed types
- **Makefile Integration**: Convenient make targets for common operations

## Database Requirements

- PostgreSQL database must be running and accessible
- Environment variables or `.env` file must be configured with `DATABASE_URL`
- Database migrations must be up to date (`make goose-up`)

## Error Handling

The tool provides detailed error messages for common issues:

- Database connection problems
- Missing environment configuration
- Duplicate constraint violations
- Invalid seed type parameters

## Development

To add new seed data:

1. Add seed data arrays to the appropriate method in `seeder.go`
2. Update the help text in `main.go` if needed
3. Test the new functionality
4. Update this documentation

Example seed data structure:

```go
brands := []struct {
    name string
}{
    {"Profilm"},
    {"NewBrand"},
    // Add more here
}
```
