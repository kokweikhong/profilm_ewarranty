package main

// import (
// 	"context"
// 	"fmt"
// 	"log"
// 	"math/rand"
// 	"time"

// 	config "github.com/kokweikhong/profilm_ewarranty/backend/configs"
// 	database "github.com/kokweikhong/profilm_ewarranty/backend/internal/db"
// 	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
// 	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/productallocations"
// 	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
// 	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
// 	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
// 	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
// )

// var (
// 	// Random data pools
// 	carBrands  = []string{"Toyota", "Honda", "Nissan", "Mazda", "Proton", "Perodua", "BMW", "Mercedes-Benz", "Audi", "Volkswagen"}
// 	carModels  = []string{"Camry", "Accord", "X-Trail", "CX-5", "X50", "Myvi", "3 Series", "C-Class", "A4", "Golf"}
// 	carColors  = []string{"White", "Black", "Silver", "Grey", "Red", "Blue", "Brown", "Green"}
// 	firstNames = []string{"Ahmad", "Ali", "Wei", "Siti", "Nurul", "Raj", "Kumar", "Tan", "Wong", "Lee", "Chen", "Lim", "Chong", "Ng", "Ong"}
// 	lastNames  = []string{"Abdullah", "Hassan", "Singh", "Muthu", "Tan", "Wong", "Lee", "Chen", "Lim", "Chong", "Ng", "Ong", "Yeoh", "Teh"}

// 	// Malaysian phone number prefixes
// 	phonePrefix = []string{"011", "012", "013", "014", "016", "017", "018", "019"}
// )

// func main() {
// 	ctx := context.Background()

// 	// Load configuration
// 	cfg, err := config.Load()
// 	if err != nil {
// 		log.Fatalf("Failed to load config: %v", err)
// 	}

// 	// Connect to database
// 	dbCfg := database.Config{
// 		// Host:     cfg.Database.Host,
// 		Host:     "localhost",
// 		Port:     cfg.Database.Port,
// 		User:     cfg.Database.User,
// 		Password: cfg.Database.Password,
// 		DBName:   cfg.Database.DBName,
// 		SSLMode:  cfg.Database.SSLMode,
// 	}

// 	pool, err := database.NewPostgresPool(ctx, dbCfg)
// 	if err != nil {
// 		log.Fatalf("Failed to connect to database: %v", err)
// 	}
// 	defer pool.Close()

// 	log.Println("Connected to database successfully")

// 	// Initialize services
// 	productsService := services.NewProductsService(pool)
// 	shopsService := services.NewShopsService(pool)
// 	productAllocationsService := services.NewProductAllocationsService(pool)
// 	warrantiesService := services.NewWarrantiesService(pool)
// 	claimsService := services.NewClaimsService(pool)

// 	// Seed data
// 	log.Println("Starting database seeding...")

// 	// 1. Seed Products (20 products)
// 	log.Println("Seeding products...")
// 	productsList, err := seedProducts(ctx, productsService, 20)
// 	if err != nil {
// 		log.Fatalf("Failed to seed products: %v", err)
// 	}
// 	log.Printf("Seeded %d products", len(productsList))

// 	// 2. Seed Shops (15 shops)
// 	log.Println("Seeding shops...")
// 	shopsList, err := seedShops(ctx, shopsService, 15)
// 	if err != nil {
// 		log.Fatalf("Failed to seed shops: %v", err)
// 	}
// 	log.Printf("Seeded %d shops", len(shopsList))

// 	// 3. Seed Product Allocations (50 allocations)
// 	log.Println("Seeding product allocations...")
// 	allocationsList, err := seedProductAllocations(ctx, productAllocationsService, productsList, shopsList, 50)
// 	if err != nil {
// 		log.Fatalf("Failed to seed product allocations: %v", err)
// 	}
// 	log.Printf("Seeded %d product allocations", len(allocationsList))

// 	// 4. Seed Warranties (100 warranties)
// 	log.Println("Seeding warranties...")
// 	warrantiesList, err := seedWarranties(ctx, warrantiesService, shopsService, shopsList, 100)
// 	if err != nil {
// 		log.Fatalf("Failed to seed warranties: %v", err)
// 	}
// 	log.Printf("Seeded %d warranties", len(warrantiesList))

// 	// 5. Seed Warranty Parts (2-4 parts per warranty)
// 	log.Println("Seeding warranty parts...")
// 	warrantyPartsList, err := seedWarrantyParts(ctx, warrantiesService, warrantiesList, allocationsList)
// 	if err != nil {
// 		log.Fatalf("Failed to seed warranty parts: %v", err)
// 	}
// 	log.Printf("Seeded %d warranty parts", len(warrantyPartsList))

// 	// 6. Seed Claims (30% of warranties)
// 	log.Println("Seeding claims...")
// 	claimsList, err := seedClaims(ctx, claimsService, warrantiesList, 30)
// 	if err != nil {
// 		log.Fatalf("Failed to seed claims: %v", err)
// 	}
// 	log.Printf("Seeded %d claims", len(claimsList))

// 	// 7. Seed Claim Warranty Parts
// 	log.Println("Seeding claim warranty parts...")
// 	claimPartsCount, err := seedClaimWarrantyParts(ctx, claimsService, claimsList, warrantyPartsList)
// 	if err != nil {
// 		log.Fatalf("Failed to seed claim warranty parts: %v", err)
// 	}
// 	log.Printf("Seeded %d claim warranty parts", claimPartsCount)

// 	log.Println("Database seeding completed successfully!")
// 	log.Printf("Summary:")
// 	log.Printf("  - Products: %d", len(productsList))
// 	log.Printf("  - Shops: %d", len(shopsList))
// 	log.Printf("  - Product Allocations: %d", len(allocationsList))
// 	log.Printf("  - Warranties: %d", len(warrantiesList))
// 	log.Printf("  - Warranty Parts: %d", len(warrantyPartsList))
// 	log.Printf("  - Claims: %d", len(claimsList))
// 	log.Printf("  - Claim Warranty Parts: %d", claimPartsCount)
// }

// func seedProducts(ctx context.Context, svc services.ProductsService, count int) ([]*products.Product, error) {
// 	var productsList []*products.Product

// 	// Get reference data
// 	brands, err := svc.ListProductBrands(ctx)
// 	if err != nil {
// 		return nil, err
// 	}
// 	types, err := svc.ListProductTypes(ctx)
// 	if err != nil {
// 		return nil, err
// 	}
// 	series, err := svc.ListProductSeries(ctx)
// 	if err != nil {
// 		return nil, err
// 	}
// 	names, err := svc.ListProductNames(ctx)
// 	if err != nil {
// 		return nil, err
// 	}

// 	for i := 0; i < count; i++ {
// 		brandID := brands[rand.Intn(len(brands))].ID
// 		typeID := types[rand.Intn(len(types))].ID
// 		seriesID := series[rand.Intn(len(series))].ID
// 		nameID := names[rand.Intn(len(names))].ID

// 		product, err := svc.CreateProduct(ctx, &products.CreateProductParams{
// 			BrandID:          brandID,
// 			TypeID:           typeID,
// 			SeriesID:         seriesID,
// 			NameID:           nameID,
// 			WarrantyInMonths: int32(rand.Intn(60) + 12), // 12-72 months
// 			FilmSerialNumber: fmt.Sprintf("FSN-%d-%05d", time.Now().Year(), rand.Intn(99999)),
// 			FilmQuantity:     int32(rand.Intn(1000) + 100),
// 			ShipmentNumber:   fmt.Sprintf("SHIP-%d-%04d", time.Now().Year(), rand.Intn(9999)),
// 			Description:      fmt.Sprintf("Product batch %d", i+1),
// 		})
// 		if err != nil {
// 			return nil, err
// 		}
// 		productsList = append(productsList, product)
// 	}

// 	return productsList, nil
// }

// func seedShops(ctx context.Context, svc services.ShopsService, count int) ([]*shops.Shop, error) {
// 	var shopsList []*shops.Shop

// 	// Get states
// 	states, err := svc.ListMsiaStates(ctx)
// 	if err != nil {
// 		return nil, err
// 	}

// 	companyNames := []string{"AutoCare", "ProFilm Center", "CarStyle", "Premium Tint", "Elite Motors"}

// 	for i := 0; i < count; i++ {
// 		state := states[rand.Intn(len(states))]
// 		stateID := state.ID

// 		// Generate branch code using service
// 		branchCode, err := svc.GenerateNextBranchCode(ctx, state.Code)
// 		if err != nil {
// 			return nil, err
// 		}

// 		companyName := fmt.Sprintf("%s %s", companyNames[rand.Intn(len(companyNames))], state.Name)

// 		shop, err := svc.CreateShop(ctx, &shops.CreateShopParams{
// 			CompanyName:               companyName,
// 			CompanyRegistrationNumber: fmt.Sprintf("%d%06d-X", rand.Intn(10), rand.Intn(999999)),
// 			CompanyLicenseImageUrl:    fmt.Sprintf("https://example.com/licenses/company_%d.jpg", i+1),
// 			CompanyContactNumber:      generatePhoneNumber(),
// 			CompanyEmail:              fmt.Sprintf("info@shop%d.example.com", i+1),
// 			CompanyWebsiteUrl:         fmt.Sprintf("https://shop%d.example.com", i+1),
// 			ShopName:                  fmt.Sprintf("%s Branch", companyName),
// 			ShopAddress:               fmt.Sprintf("%d, Jalan Example %d, %s", rand.Intn(100)+1, i+1, state.Name),
// 			MsiaStateID:               &stateID,
// 			BranchCode:                branchCode,
// 			ShopImageUrl:              fmt.Sprintf("https://example.com/shops/shop_%d.jpg", i+1),
// 			PicName:                   fmt.Sprintf("%s %s", firstNames[rand.Intn(len(firstNames))], lastNames[rand.Intn(len(lastNames))]),
// 			PicPosition:               "Manager",
// 			PicContactNumber:          generatePhoneNumber(),
// 			PicEmail:                  fmt.Sprintf("manager%d@shop%d.example.com", i+1, i+1),
// 		})
// 		if err != nil {
// 			return nil, err
// 		}
// 		shopsList = append(shopsList, shop)
// 	}

// 	return shopsList, nil
// }

// func seedProductAllocations(ctx context.Context, svc services.ProductAllocationsService, productsList []*products.Product, shopsList []*shops.Shop, count int) ([]*productallocations.ProductAllocation, error) {
// 	var allocationsList []*productallocations.ProductAllocation

// 	for i := 0; i < count; i++ {
// 		product := productsList[rand.Intn(len(productsList))]
// 		shop := shopsList[rand.Intn(len(shopsList))]

// 		// Random date within the last 6 months
// 		daysAgo := rand.Intn(180)
// 		allocationDate := time.Now().AddDate(0, 0, -daysAgo)

// 		allocation, err := svc.CreateProductAllocation(ctx, &productallocations.CreateProductAllocationParams{
// 			ProductID:      product.ID,
// 			ShopID:         shop.ID,
// 			FilmQuantity:   int32(rand.Intn(100) + 10),
// 			AllocationDate: allocationDate,
// 		})
// 		if err != nil {
// 			return nil, err
// 		}
// 		allocationsList = append(allocationsList, allocation)
// 	}

// 	return allocationsList, nil
// }

// func seedWarranties(ctx context.Context, warrantiesService services.WarrantiesService, shopsService services.ShopsService, shopsList []*shops.Shop, count int) ([]*warranties.Warranty, error) {
// 	var warrantiesList []*warranties.Warranty

// 	for i := 0; i < count; i++ {
// 		shop := shopsList[rand.Intn(len(shopsList))]

// 		// Random installation date within the last 3 months
// 		daysAgo := rand.Intn(90)
// 		installationDate := time.Now().AddDate(0, 0, -daysAgo)

// 		// Get shop details for branch code
// 		shopDetail, err := shopsService.GetShopByID(ctx, shop.ID)
// 		if err != nil {
// 			return nil, err
// 		}

// 		// Format installation date as YYMMDD
// 		installDateStr := installationDate.Format("060102")

// 		// Generate warranty number using service
// 		warrantyNo, err := warrantiesService.GenerateNextWarrantyNo(ctx, shopDetail.BranchCode, installDateStr)
// 		if err != nil {
// 			return nil, err
// 		}

// 		// 30% chance of having a reference number
// 		var refNo *string
// 		if rand.Float32() < 0.3 {
// 			ref := fmt.Sprintf("REF-%05d", rand.Intn(99999))
// 			refNo = &ref
// 		}

// 		clientFirstName := firstNames[rand.Intn(len(firstNames))]
// 		clientLastName := lastNames[rand.Intn(len(lastNames))]

// 		warranty, err := warrantiesService.CreateWarranty(ctx, &warranties.CreateWarrantyParams{
// 			ShopID:               shop.ID,
// 			ClientName:           fmt.Sprintf("%s %s", clientFirstName, clientLastName),
// 			ClientContact:        generatePhoneNumber(),
// 			ClientEmail:          fmt.Sprintf("%s.%s@example.com", clientFirstName, clientLastName),
// 			CarBrand:             carBrands[rand.Intn(len(carBrands))],
// 			CarModel:             carModels[rand.Intn(len(carModels))],
// 			CarColour:            carColors[rand.Intn(len(carColors))],
// 			CarPlateNo:           generateCarPlateNumber(),
// 			CarChassisNo:         fmt.Sprintf("CHASSIS-%s-%05d", generateRandomString(5), rand.Intn(99999)),
// 			InstallationDate:     installationDate,
// 			ReferenceNo:          refNo,
// 			WarrantyNo:           warrantyNo,
// 			InvoiceAttachmentUrl: fmt.Sprintf("https://example.com/invoices/invoice_%d.pdf", i+1),
// 		})
// 		if err != nil {
// 			return nil, err
// 		}
// 		warrantiesList = append(warrantiesList, warranty)
// 	}

// 	return warrantiesList, nil
// }

// func seedWarrantyParts(ctx context.Context, svc services.WarrantiesService, warrantiesList []*warranties.Warranty, allocationsList []*productallocations.ProductAllocation) ([]*warranties.WarrantyPart, error) {
// 	var warrantyPartsList []*warranties.WarrantyPart

// 	// Get car parts
// 	carParts, err := svc.GetCarParts(ctx)
// 	if err != nil {
// 		return nil, err
// 	}

// 	for _, warranty := range warrantiesList {
// 		// Each warranty has 2-4 parts
// 		numParts := rand.Intn(3) + 2
// 		usedCarParts := make(map[int32]bool)

// 		for j := 0; j < numParts; j++ {
// 			// Select a car part that hasn't been used for this warranty
// 			var carPart *warranties.CarPart
// 			for {
// 				carPart = carParts[rand.Intn(len(carParts))]
// 				if !usedCarParts[carPart.ID] {
// 					usedCarParts[carPart.ID] = true
// 					break
// 				}
// 			}

// 			allocation := allocationsList[rand.Intn(len(allocationsList))]

// 			part, err := svc.CreateWarrantyPart(ctx, &warranties.CreateWarrantyPartParams{
// 				WarrantyID:           warranty.ID,
// 				ProductAllocationID:  allocation.ID,
// 				CarPartID:            carPart.ID,
// 				InstallationImageUrl: fmt.Sprintf("https://example.com/installations/warranty_%d_part_%d.jpg", warranty.ID, j+1),
// 			})
// 			if err != nil {
// 				return nil, err
// 			}
// 			warrantyPartsList = append(warrantyPartsList, part)
// 		}
// 	}

// 	return warrantyPartsList, nil
// }

// func seedClaims(ctx context.Context, svc services.ClaimsService, warrantiesList []*warranties.Warranty, percentage int) ([]*claims.Claim, error) {
// 	var claimsList []*claims.Claim

// 	// Calculate how many warranties should have claims
// 	numClaims := len(warrantiesList) * percentage / 100

// 	// Shuffle warranties to randomly select which ones have claims
// 	shuffledWarranties := make([]*warranties.Warranty, len(warrantiesList))
// 	copy(shuffledWarranties, warrantiesList)
// 	rand.Shuffle(len(shuffledWarranties), func(i, j int) {
// 		shuffledWarranties[i], shuffledWarranties[j] = shuffledWarranties[j], shuffledWarranties[i]
// 	})

// 	for i := 0; i < numClaims; i++ {
// 		warranty := shuffledWarranties[i]

// 		// Claim date should be after installation date
// 		claimDate := warranty.InstallationDate.AddDate(0, 0, rand.Intn(60)+7) // 7-67 days after installation

// 		// Generate simple claim number
// 		claimNo := fmt.Sprintf("CLM-%s-%04d", claimDate.Format("060102"), i+1)

// 		claim, err := svc.CreateClaim(ctx, &claims.CreateClaimParams{
// 			WarrantyID: warranty.ID,
// 			ClaimNo:    claimNo,
// 			ClaimDate:  claimDate,
// 		})
// 		if err != nil {
// 			return nil, err
// 		}
// 		claimsList = append(claimsList, claim)
// 	}

// 	return claimsList, nil
// }

// func seedClaimWarrantyParts(ctx context.Context, svc services.ClaimsService, claimsList []*claims.Claim, warrantyPartsList []*warranties.WarrantyPart) (int, error) {
// 	count := 0

// 	// Create a map of warranty ID to warranty parts for easy lookup
// 	warrantyPartsMap := make(map[int32][]*warranties.WarrantyPart)
// 	for _, part := range warrantyPartsList {
// 		warrantyPartsMap[part.WarrantyID] = append(warrantyPartsMap[part.WarrantyID], part)
// 	}

// 	for _, claim := range claimsList {
// 		parts, ok := warrantyPartsMap[claim.WarrantyID]
// 		if !ok || len(parts) == 0 {
// 			continue
// 		}

// 		// Each claim affects 1-2 parts
// 		numParts := rand.Intn(2) + 1
// 		if numParts > len(parts) {
// 			numParts = len(parts)
// 		}

// 		// Shuffle parts
// 		shuffledParts := make([]*warranties.WarrantyPart, len(parts))
// 		copy(shuffledParts, parts)
// 		rand.Shuffle(len(shuffledParts), func(i, j int) {
// 			shuffledParts[i], shuffledParts[j] = shuffledParts[j], shuffledParts[i]
// 		})

// 		for i := 0; i < numParts; i++ {
// 			part := shuffledParts[i]

// 			// 60% chance of being resolved
// 			var resolutionDate *time.Time
// 			var resolutionImageUrl *string
// 			var remarks *string

// 			if rand.Float32() < 0.6 {
// 				resDate := claim.ClaimDate.AddDate(0, 0, rand.Intn(14)+1) // 1-14 days after claim
// 				resolutionDate = &resDate
// 				resImage := fmt.Sprintf("https://example.com/resolutions/claim_%d_part_%d.jpg", claim.ID, i+1)
// 				resolutionImageUrl = &resImage
// 				rem := "Issue resolved successfully"
// 				remarks = &rem
// 			} else {
// 				rem := "Under investigation"
// 				remarks = &rem
// 			}

// 			_, err := svc.CreateClaimWarrantyPart(ctx, &claims.CreateClaimWarrantyPartParams{
// 				ClaimID:            claim.ID,
// 				WarrantyPartID:     part.ID,
// 				DamagedImageUrl:    fmt.Sprintf("https://example.com/damages/claim_%d_part_%d.jpg", claim.ID, i+1),
// 				Remarks:            remarks,
// 				ResolutionDate:     resolutionDate,
// 				ResolutionImageUrl: resolutionImageUrl,
// 			})
// 			if err != nil {
// 				return count, err
// 			}
// 			count++
// 		}
// 	}

// 	return count, nil
// }

// // Helper functions
// func generatePhoneNumber() string {
// 	prefix := phonePrefix[rand.Intn(len(phonePrefix))]
// 	number := rand.Intn(9000000) + 1000000 // 7 digit number
// 	return fmt.Sprintf("+60-%s-%d", prefix, number)
// }

// func generateCarPlateNumber() string {
// 	states := []string{"A", "B", "C", "D", "V", "W", "P", "R", "T", "K", "M", "N", "J", "H"}
// 	state := states[rand.Intn(len(states))]
// 	letters := generateRandomString(3)
// 	number := rand.Intn(9000) + 1000
// 	return fmt.Sprintf("%s%s %d", state, letters, number)
// }

// func generateRandomString(length int) string {
// 	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
// 	result := make([]byte, length)
// 	for i := range result {
// 		result[i] = charset[rand.Intn(len(charset))]
// 	}
// 	return string(result)
// }
