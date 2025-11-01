package dummy

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
)

// Generator handles dummy data generation operations
type Generator struct {
	db           *pgxpool.Pool
	productQueries *products.Queries
	shopQueries    *shops.Queries
}

// NewGenerator creates a new Generator instance
func NewGenerator(db *pgxpool.Pool) *Generator {
	return &Generator{
		db:             db,
		productQueries: products.New(db),
		shopQueries:    shops.New(db),
	}
}

// GenerateProducts generates dummy products
func (g *Generator) GenerateProducts(ctx context.Context, count int) error {
	fmt.Printf("🔄 Generating %d dummy products...\n", count)

	// Get existing product names, brands, and warranty years
	productNames, err := g.productQueries.ListProductNames(ctx)
	if err != nil {
		return fmt.Errorf("failed to list product names: %w", err)
	}

	productBrands, err := g.productQueries.ListProductBrands(ctx)
	if err != nil {
		return fmt.Errorf("failed to list product brands: %w", err)
	}

	warrantyYears, err := g.productQueries.ListWarrantyYears(ctx)
	if err != nil {
		return fmt.Errorf("failed to list warranty years: %w", err)
	}

	if len(productNames) == 0 {
		return fmt.Errorf("no product names found, please run seeds first")
	}
	if len(productBrands) == 0 {
		return fmt.Errorf("no product brands found, please run seeds first")
	}
	if len(warrantyYears) == 0 {
		return fmt.Errorf("no warranty years found, please run seeds first")
	}

	// Generate products
	for i := 0; i < count; i++ {
		// Random selections
		productName := productNames[rand.Intn(len(productNames))]
		productBrand := productBrands[rand.Intn(len(productBrands))]
		warrantyYear := warrantyYears[rand.Intn(len(warrantyYears))]

		// Generate unique serial number with timestamp
		serialNo := fmt.Sprintf("SN%d%06d_%d", time.Now().Year(), i+1, time.Now().UnixNano()%1000000)

		// Random quantity and shipment
		quantity := rand.Intn(100) + 1
		shipmentNo := fmt.Sprintf("SHIP-%d-%04d", time.Now().Year(), i+1)

		params := &products.CreateProductParams{
			ProductNameID:   productName.ID,
			ProductBrandID:  productBrand.ID,
			WarrantyYears:   warrantyYear.Years,
			FilmSerialNo:    serialNo,
			FilmQuantity:    int32(quantity),
			FilmShipmentNo:  shipmentNo,
		}

		createdProduct, err := g.productQueries.CreateProduct(ctx, params)
		if err != nil {
			return fmt.Errorf("failed to create product %d: %w", i+1, err)
		}

		if (i+1)%10 == 0 || i == count-1 {
			fmt.Printf("  ✅ Generated %d/%d products (Latest: %s - %s)\n", 
				i+1, count, createdProduct.FilmSerialNo, productName.Name)
		}
	}

	return nil
}

// GenerateShops generates dummy shops
func (g *Generator) GenerateShops(ctx context.Context, count int) error {
	fmt.Printf("🔄 Generating %d dummy shops...\n", count)

	// Get existing states
	states, err := g.shopQueries.ListStates(ctx)
	if err != nil {
		return fmt.Errorf("failed to list states: %w", err)
	}

	if len(states) == 0 {
		return fmt.Errorf("no states found, please run seeds first")
	}

	// Shop name templates
	shopTypes := []string{"Retail", "Authorized Dealer", "Service Center", "Premium Outlet", "Flagship Store"}
	shopNamePrefixes := []string{"ProFilm", "AutoCare", "CarGuard", "Premium", "Elite", "Superior", "Advanced", "Professional"}
	shopNameSuffixes := []string{"Center", "Hub", "Studio", "Workshop", "Garage", "Service", "Store", "Outlet"}

	// Generate shops
	for i := 0; i < count; i++ {
		state := states[rand.Intn(len(states))]
		shopType := shopTypes[rand.Intn(len(shopTypes))]
		
		// Generate shop name
		prefix := shopNamePrefixes[rand.Intn(len(shopNamePrefixes))]
		suffix := shopNameSuffixes[rand.Intn(len(shopNameSuffixes))]
		shopName := fmt.Sprintf("%s %s %s", prefix, state.Name, suffix)
		
		// Generate company details
		companyName := fmt.Sprintf("%s Sdn Bhd", shopName)
		regNo := fmt.Sprintf("SSM%d%06d", time.Now().Year(), i+1)
		username := fmt.Sprintf("shop_%s_%04d_%d", 
			fmt.Sprintf("%s_%s", prefix, suffix), i+1, time.Now().UnixNano()%10000)
		
		// Generate contact details
		email := fmt.Sprintf("contact@%s.com", 
			fmt.Sprintf("%s%s", prefix, suffix))
		phone := fmt.Sprintf("03-%d%d%d", 
			rand.Intn(9)+1, rand.Intn(900)+100, rand.Intn(9000)+1000)
		
		// Generate PIC details
		picNames := []string{"Ahmad Rahman", "Siti Nurhaliza", "Lim Wei Ming", "Raj Kumar", "Chen Li Hua"}
		picPositions := []string{"Manager", "Owner", "Assistant Manager", "Supervisor", "Director"}
		picName := picNames[rand.Intn(len(picNames))]
		picPosition := picPositions[rand.Intn(len(picPositions))]
		picEmail := fmt.Sprintf("%s@%s.com", 
			fmt.Sprintf("%s%d", "pic", i+1), 
			fmt.Sprintf("%s%s", prefix, suffix))

		params := &shops.CreateShopParams{
			StateID:                state.ID,
			CompanyName:            companyName,
			CompanyRegistrationNo:  regNo,
			CompanyLicenseImageUrl: fmt.Sprintf("https://storage.example.com/licenses/license_%d.jpg", i+1),
			CompanyEmail:          email,
			CompanyContact:        phone,
			Name:                  shopName,
			Type:                  shopType,
			Address:               fmt.Sprintf("No. %d, Jalan %s %d, %s", 
				rand.Intn(999)+1, state.Name, rand.Intn(10)+1, state.Name),
			ImageUrl:             fmt.Sprintf("https://storage.example.com/shops/shop_%d.jpg", i+1),
			PicName:              picName,
			PicContact:           phone,
			PicEmail:             picEmail,
			PicPosition:          picPosition,
			Username:             username,
			LoginHashPassword:    "$2a$10$dummy.hash.password.for.testing.purposes.only",
		}

		// Set optional company website
		if rand.Float32() < 0.7 { // 70% chance of having website
			website := fmt.Sprintf("https://www.%s%s.com", prefix, suffix)
			params.CompanyWebsite.String = website
			params.CompanyWebsite.Valid = true
		}

		// Set active status (95% active)
		params.IsActive.Bool = rand.Float32() < 0.95
		params.IsActive.Valid = true

		createdShop, err := g.shopQueries.CreateShop(ctx, params)
		if err != nil {
			return fmt.Errorf("failed to create shop %d: %w", i+1, err)
		}

		if (i+1)%10 == 0 || i == count-1 {
			fmt.Printf("  ✅ Generated %d/%d shops (Latest: %s - %s)\n", 
				i+1, count, createdShop.Name, state.Name)
		}
	}

	return nil
}

// GenerateProductAllocations generates dummy product allocations
func (g *Generator) GenerateProductAllocations(ctx context.Context, count int) error {
	fmt.Printf("🔄 Generating %d dummy product allocations...\n", count)

	// Get existing products and shops
	existingProducts, err := g.productQueries.ListProducts(ctx)
	if err != nil {
		return fmt.Errorf("failed to list products: %w", err)
	}

	existingShops, err := g.shopQueries.ListShops(ctx)
	if err != nil {
		return fmt.Errorf("failed to list shops: %w", err)
	}

	if len(existingProducts) == 0 {
		return fmt.Errorf("no products found, please generate products first")
	}
	if len(existingShops) == 0 {
		return fmt.Errorf("no shops found, please generate shops first")
	}

	// Generate allocations
	for i := 0; i < count; i++ {
		// Random selections
		product := existingProducts[rand.Intn(len(existingProducts))]
		shop := existingShops[rand.Intn(len(existingShops))]
		
		// Random allocation quantity (1-50)
		allocQuantity := rand.Intn(50) + 1

		params := &shops.CreateProductAllocationParams{
			ProductID:    product.ID,
			ShopID:       shop.ID,
			FilmQuantity: int32(allocQuantity),
		}

		createdAllocation, err := g.shopQueries.CreateProductAllocation(ctx, params)
		if err != nil {
			return fmt.Errorf("failed to create product allocation %d: %w", i+1, err)
		}

		if (i+1)%10 == 0 || i == count-1 {
			fmt.Printf("  ✅ Generated %d/%d allocations (Latest: %d units to shop)\n", 
				i+1, count, createdAllocation.FilmQuantity)
		}
	}

	return nil
}

// GenerateAll generates all dummy data types
func (g *Generator) GenerateAll(ctx context.Context, count int) error {
	fmt.Printf("🔄 Generating %d records of each type...\n", count)

	// Generate in dependency order
	if err := g.GenerateProducts(ctx, count); err != nil {
		return fmt.Errorf("failed to generate products: %w", err)
	}

	if err := g.GenerateShops(ctx, count); err != nil {
		return fmt.Errorf("failed to generate shops: %w", err)
	}

	if err := g.GenerateProductAllocations(ctx, count); err != nil {
		return fmt.Errorf("failed to generate product allocations: %w", err)
	}

	fmt.Println("✅ All dummy data generated successfully!")
	return nil
}