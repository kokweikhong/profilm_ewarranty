package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	config "github.com/kokweikhong/profilm_ewarranty/backend/configs"
	database "github.com/kokweikhong/profilm_ewarranty/backend/internal/db"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/claims"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/productallocations"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/warranties"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/services"
)

var (
	phonePrefix = []string{"011", "012", "013", "014", "016", "017", "018", "019"}
	carBrands   = []string{
		"Toyota",
		"Honda",
		"Nissan",
		"Mazda",
		"Subaru",
		"Mitsubishi",
		"Suzuki",
		"Lexus",
		"Infiniti",
		"Acura",
		"BMW",
		"Mercedes-Benz",
		"Audi",
		"Volkswagen",
		"Porsche",
		"Ford",
		"Chevrolet",
		"Tesla",
		"Jeep",
		"Dodge",
		"Chrysler",
		"Cadillac",
		"Buick",
		"GMC",
		"Lincoln",
		"Hyundai",
		"Kia",
		"Genesis",
		"Peugeot",
		"Renault",
		"Citroen",
		"Fiat",
		"Alfa Romeo",
		"Ferrari",
		"Lamborghini",
		"Maserati",
		"Volvo",
		"Saab",
		"Jaguar",
		"Land Rover",
		"Mini",
		"Rolls-Royce",
		"Bentley",
		"Bugatti",
		"McLaren",
		"Aston Martin",
		"Geely",
		"Chery",
		"BYD",
		"Great Wall",
	}

	carModels = []string{
		"Camry",       // Toyota
		"Civic",       // Honda
		"Altima",      // Nissan
		"CX-5",        // Mazda
		"Forester",    // Subaru
		"Xpander",     // Mitsubishi
		"Swift",       // Suzuki
		"ES",          // Lexus
		"Q50",         // Infiniti
		"TLX",         // Acura
		"3 Series",    // BMW
		"C-Class",     // Mercedes-Benz
		"A4",          // Audi
		"Golf",        // Volkswagen
		"Cayenne",     // Porsche
		"Ranger",      // Ford
		"Colorado",    // Chevrolet
		"Model 3",     // Tesla
		"Wrangler",    // Jeep
		"Charger",     // Dodge
		"300",         // Chrysler
		"CT5",         // Cadillac
		"Encore",      // Buick
		"Sierra",      // GMC
		"Navigator",   // Lincoln
		"Tucson",      // Hyundai
		"Sportage",    // Kia
		"G80",         // Genesis
		"3008",        // Peugeot
		"Captur",      // Renault
		"C5 Aircross", // Citroen
		"500",         // Fiat
		"Giulia",      // Alfa Romeo
		"Roma",        // Ferrari
		"Huracan",     // Lamborghini
		"Ghibli",      // Maserati
		"XC60",        // Volvo
		"9-3",         // Saab
		"XE",          // Jaguar
		"Defender",    // Land Rover
		"Cooper",      // Mini
		"Ghost",       // Rolls-Royce
		"Continental", // Bentley
		"Chiron",      // Bugatti
		"720S",        // McLaren
		"DB11",        // Aston Martin
		"Coolray",     // Geely
		"Tiggo 7",     // Chery
		"Atto 3",      // BYD
		"Haval H6",    // Great Wall
	}

	carColors = []string{
		"White",
		"Black",
		"Silver",
		"Gray",
		"Red",
		"Blue",
		"Green",
		"Yellow",
		"Orange",
		"Brown",
		"Beige",
		"Gold",
		"Bronze",
		"Copper",
		"Champagne",
		"Ivory",
		"Cream",
		"Pearl White",
		"Snow White",
		"Jet Black",
		"Midnight Black",
		"Obsidian Black",
		"Onyx Black",
		"Graphite Gray",
		"Gunmetal Gray",
		"Steel Gray",
		"Charcoal Gray",
		"Slate Gray",
		"Platinum Silver",
		"Liquid Silver",
		"Titanium Silver",
		"Arctic Silver",
		"Racing Red",
		"Crimson Red",
		"Maroon",
		"Burgundy",
		"Ruby Red",
		"Scarlet",
		"Candy Apple Red",
		"Navy Blue",
		"Midnight Blue",
		"Royal Blue",
		"Sky Blue",
		"Baby Blue",
		"Ice Blue",
		"Aqua Blue",
		"Teal",
		"Turquoise",
		"Emerald Green",
		"Forest Green",
		"Olive Green",
		"Mint Green",
		"Lime Green",
		"British Racing Green",
		"Canary Yellow",
		"Sunshine Yellow",
		"Mustard Yellow",
		"Amber",
		"Burnt Orange",
		"Sunset Orange",
		"Tangerine",
		"Pumpkin Orange",
		"Chocolate Brown",
		"Mocha Brown",
		"Coffee Brown",
		"Walnut Brown",
		"Sand",
		"Khaki",
		"Desert Beige",
		"Stone",
		"Taupe",
		"Rose Gold",
		"Blush Pink",
		"Hot Pink",
		"Magenta",
		"Purple",
		"Violet",
		"Lavender",
		"Plum",
		"Indigo",
		"Electric Blue",
		"Neon Green",
		"Matte Black",
		"Matte Gray",
		"Matte White",
		"Satin Silver",
		"Metallic Blue",
		"Metallic Red",
		"Metallic Gray",
		"Pearlescent White",
		"Carbon Black",
	}

	firstNames = []string{
		"Adam",
		"Alex",
		"Aaron",
		"Andrew",
		"Anthony",
		"Benjamin",
		"Brian",
		"Brandon",
		"Caleb",
		"Charles",
		"Chris",
		"Daniel",
		"David",
		"Dylan",
		"Edward",
		"Ethan",
		"Evan",
		"Frank",
		"Gabriel",
		"George",
		"Henry",
		"Ian",
		"Isaac",
		"Jack",
		"Jacob",
		"James",
		"Jason",
		"Jeremy",
		"John",
		"Jonathan",
		"Joseph",
		"Joshua",
		"Justin",
		"Kevin",
		"Kyle",
		"Leonard",
		"Lucas",
		"Mark",
		"Matthew",
		"Michael",
		"Nathan",
		"Nicholas",
		"Noah",
		"Oliver",
		"Oscar",
		"Patrick",
		"Paul",
		"Peter",
		"Philip",
		"Ryan",
		"Samuel",
		"Scott",
		"Sean",
		"Stephen",
		"Thomas",
		"Timothy",
		"Victor",
		"William",
		"Zachary",
		"Aiden",
		"Blake",
		"Cameron",
		"Connor",
		"Dominic",
		"Elijah",
		"Felix",
		"Harvey",
		"Julian",
		"Leo",
		"Liam",
		"Marcus",
		"Mason",
		"Max",
		"Miles",
		"Oliver",
		"Owen",
		"Rafael",
		"Sebastian",
		"Theodore",
		"Tristan",
		"Vincent",
		"Wesley",
		"Xavier",
		"Yusuf",
		"Zane",
	}

	lastNames = []string{
		"Adam",
		"Alex",
		"Aaron",
		"Andrew",
		"Anthony",
		"Benjamin",
		"Brian",
		"Brandon",
		"Caleb",
		"Charles",
		"Chris",
		"Daniel",
		"David",
		"Dylan",
		"Edward",
		"Ethan",
		"Evan",
		"Frank",
		"Gabriel",
		"George",
		"Henry",
		"Ian",
		"Isaac",
		"Jack",
		"Jacob",
		"James",
		"Jason",
		"Jeremy",
		"John",
		"Jonathan",
		"Joseph",
		"Joshua",
		"Justin",
		"Kevin",
		"Kyle",
		"Leonard",
		"Lucas",
		"Mark",
		"Matthew",
		"Michael",
		"Nathan",
		"Nicholas",
		"Noah",
		"Oliver",
		"Oscar",
		"Patrick",
		"Paul",
		"Peter",
		"Philip",
		"Ryan",
		"Samuel",
		"Scott",
		"Sean",
		"Stephen",
		"Thomas",
		"Timothy",
		"Victor",
		"William",
		"Zachary",
		"Aiden",
		"Blake",
		"Cameron",
		"Connor",
		"Dominic",
		"Elijah",
		"Felix",
		"Harvey",
		"Julian",
		"Leo",
		"Liam",
		"Marcus",
		"Mason",
		"Max",
		"Miles",
		"Oliver",
		"Owen",
		"Rafael",
		"Sebastian",
		"Theodore",
		"Tristan",
		"Vincent",
		"Wesley",
		"Xavier",
		"Yusuf",
		"Zane",
	}

	warrantyMonths = []int32{12, 24, 36, 48, 60, 72}
)

var spacesUrl = "https://profilm.sgp1.cdn.digitaloceanspaces.com/testing/"

func main() {
	ctx := context.Background()

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	dbCfg := database.Config{
		// Host:     cfg.Database.Host,
		Host:     "localhost",
		Port:     cfg.Database.Port,
		User:     cfg.Database.User,
		Password: cfg.Database.Password,
		DBName:   cfg.Database.DBName,
		SSLMode:  cfg.Database.SSLMode,
	}

	pool, err := database.NewPostgresPool(ctx, dbCfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	log.Println("Connected to database successfully")

	// Initialize services
	usersService := services.NewUsersService(pool)
	productsService := services.NewProductsService(pool)
	shopsService := services.NewShopsService(pool)
	productAllocationsService := services.NewProductAllocationsService(pool)
	warrantiesService := services.NewWarrantiesService(pool)
	claimsService := services.NewClaimsService(pool)

	// Seed data
	log.Println("Starting database seeding...")

	// 1. Seed Admin User
	var isAdminCreated bool
	log.Println("Seeding admin user...")
	// Check if admin user already exists
	_, err = usersService.GetUserByUsername(ctx, "admin")
	if err != nil {
		if err.Error() == "no rows in result set" {
			_, err := usersService.CreateUser(ctx, nil, "admin", "admin", "admin@profilm")
			if err != nil {
				log.Fatalf("Failed to create admin user: %v", err)
			}
			log.Println("Admin user created with username 'admin' and password 'admin@profilm'")
			isAdminCreated = true
		} else {
			log.Fatalf("Failed to check for existing admin user: %v", err)
		}
	} else {
		log.Println("Admin user already exists")
	}

	// 2. Seed Products (20 products)
	log.Println("Seeding products...")
	productsList, err := seedProducts(ctx, productsService, 20)
	if err != nil {
		log.Fatalf("Failed to seed products: %v", err)
	}
	log.Printf("Seeded %d products", len(productsList))

	// 2. Seed Shops (15 shops)
	log.Println("Seeding shops...")

	shopsList, err := seedShops(ctx, shopsService, 15)
	if err != nil {
		log.Fatalf("Failed to seed shops: %v", err)
	}
	log.Printf("Seeded %d shops", len(shopsList))

	// 3. Seed Product Allocations (50 allocations)
	log.Println("Seeding product allocations...")
	allocationsList, err := seedProductAllocations(ctx, productAllocationsService, productsList, shopsList, 50)
	if err != nil {
		log.Fatalf("Failed to seed product allocations: %v", err)
	}
	log.Printf("Seeded %d product allocations", len(allocationsList))

	// 4. Seed Warranties (100 warranties)
	log.Println("Seeding warranties...")
	warrantiesList, err := seedWarranties(ctx, warrantiesService, productAllocationsService, shopsList, 10)
	if err != nil {
		log.Fatalf("Failed to seed warranties: %v", err)
	}
	log.Printf("Seeded %d warranties", len(warrantiesList))

	// 6. Seed Claims (30% of warranties)
	log.Println("Seeding claims...")
	claimsList, err := seedClaims(ctx, claimsService, warrantiesService, warrantiesList, len(warrantiesList)*30/100)
	if err != nil {
		log.Fatalf("Failed to seed claims: %v", err)
	}
	log.Printf("Seeded %d claims", len(claimsList))
	log.Println("Database seeding completed successfully!")
	log.Printf("Summary:")
	// log print if admin user created
	if isAdminCreated {
		log.Printf("  - Admin User: created")
	} else {
		log.Printf("  - Admin User: already exists")
	}
	log.Printf("  - Products: %d", len(productsList))
	log.Printf("  - Shops: %d", len(shopsList))
	log.Printf("  - Product Allocations: %d", len(allocationsList))
	log.Printf("  - Warranties: %d", len(warrantiesList))
	log.Printf("  - Claims: %d", len(claimsList))
}

func seedProducts(ctx context.Context, svc services.ProductsService, count int) ([]*products.Product, error) {
	var productsList []*products.Product
	for i := 0; i < count; i++ {
		brands, err := svc.ListProductBrands(ctx)
		if err != nil || len(brands) == 0 {
			log.Fatalf("Failed to list product brands: %v", err)
		}
		brand := brands[rand.Intn(len(brands))]
		types, err := svc.ListProductTypes(ctx)
		var filteredTypes []*products.ProductType
		for _, t := range types {
			if t.BrandID == brand.ID {
				filteredTypes = append(filteredTypes, t)
			}
		}
		if err != nil || len(filteredTypes) == 0 {
			log.Fatalf("Failed to list product types for brand ID %d: %v", brand.ID, err)
		}
		productTypeObj := filteredTypes[rand.Intn(len(filteredTypes))]
		series, err := svc.ListProductSeries(ctx)
		var filteredSeries []*products.ProductSeries
		for _, s := range series {
			if s.TypeID == productTypeObj.ID {
				filteredSeries = append(filteredSeries, s)
			}
		}
		if err != nil || len(filteredSeries) == 0 {
			log.Fatalf("Failed to list product series for type ID %d: %v", productTypeObj.ID, err)
		}
		productSeriesObj := filteredSeries[rand.Intn(len(filteredSeries))]
		names, err := svc.ListProductNames(ctx)
		var filteredNames []*products.ProductName
		for _, n := range names {
			if n.SeriesID == productSeriesObj.ID {
				filteredNames = append(filteredNames, n)
			}
		}
		if err != nil || len(filteredNames) == 0 {
			log.Fatalf("Failed to list product names for series ID %d: %v", productSeriesObj.ID, err)
		}
		productNameObj := filteredNames[rand.Intn(len(filteredNames))]
		product, err := svc.CreateProduct(ctx, &products.CreateProductParams{
			BrandID:          brand.ID,
			TypeID:           productTypeObj.ID,
			SeriesID:         productSeriesObj.ID,
			NameID:           productNameObj.ID,
			WarrantyInMonths: warrantyMonths[rand.Intn(len(warrantyMonths))],
			FilmSerialNumber: fmt.Sprintf("FSN-%d-%05d", time.Now().Year(), rand.Intn(99999)),
			FilmQuantity:     int32(rand.Intn(1000) + 100),
			ShipmentNumber:   fmt.Sprintf("SHIP-%d-%04d", time.Now().Year(), rand.Intn(9999)),
			Description:      fmt.Sprintf("Product batch %d", i+1),
		})
		if err != nil {
			return nil, err
		}
		productsList = append(productsList, product)
	}

	return productsList, nil
}

func seedShops(ctx context.Context, svc services.ShopsService, count int) ([]*shops.Shop, error) {
	var (
		shopsList []*shops.Shop

		sampleCompanyLicenseImageUrl = spacesUrl + "sample_ssm.jpg"
		sampleShopImageUrl           = spacesUrl + "sample_shop.jpg"
	)

	// Get states
	states, err := svc.ListMsiaStates(ctx)
	if err != nil {
		return nil, err
	}

	companyNames := []string{"AutoCare", "ProFilm Center", "CarStyle", "Premium Tint", "Elite Motors"}

	for i := 0; i < count; i++ {
		state := states[rand.Intn(len(states))]
		stateID := state.ID

		// Generate branch code using service
		branchCode, err := svc.GenerateNextBranchCode(ctx, state.Code)
		if err != nil {
			return nil, err
		}

		companyName := companyNames[rand.Intn(len(companyNames))]

		shop, err := svc.CreateShop(ctx, &shops.CreateShopParams{
			CompanyName:               companyName,
			CompanyRegistrationNumber: fmt.Sprintf("%d%06d-X", rand.Intn(10), rand.Intn(999999)),
			CompanyLicenseImageUrl:    sampleCompanyLicenseImageUrl,
			CompanyContactNumber:      generatePhoneNumber(),
			CompanyEmail:              fmt.Sprintf("info@shop%d.example.com", i+1),
			CompanyWebsiteUrl:         fmt.Sprintf("https://shop%d.example.com", i+1),
			ShopName:                  fmt.Sprintf("%s Branch", companyName),
			ShopAddress:               fmt.Sprintf("%d, Jalan Example %d, %s", rand.Intn(100)+1, i+1, state.Name),
			MsiaStateID:               &stateID,
			BranchCode:                branchCode,
			ShopImageUrl:              sampleShopImageUrl,
			PicName:                   fmt.Sprintf("%s %s", firstNames[rand.Intn(len(firstNames))], lastNames[rand.Intn(len(lastNames))]),
			PicPosition:               "Manager",
			PicContactNumber:          generatePhoneNumber(),
			PicEmail:                  fmt.Sprintf("manager%d@shop%d.example.com", i+1, i+1),
		})
		if err != nil {
			return nil, err
		}
		shopsList = append(shopsList, shop)
	}

	return shopsList, nil
}

func seedProductAllocations(ctx context.Context, svc services.ProductAllocationsService, productsList []*products.Product, shopsList []*shops.Shop, count int) ([]*productallocations.ProductAllocation, error) {
	var allocationsList []*productallocations.ProductAllocation

	for range count {
		product := productsList[rand.Intn(len(productsList))]
		shop := shopsList[rand.Intn(len(shopsList))]

		// Random date within the last 6 months
		daysAgo := rand.Intn(180)
		allocationDate := time.Now().AddDate(0, 0, -daysAgo)

		allocation, err := svc.CreateProductAllocation(ctx, &productallocations.CreateProductAllocationParams{
			ProductID:      product.ID,
			ShopID:         shop.ID,
			FilmQuantity:   int32(rand.Intn(100) + 10),
			AllocationDate: allocationDate,
		})
		if err != nil {
			return nil, err
		}
		allocationsList = append(allocationsList, allocation)
	}

	return allocationsList, nil
}

func seedWarranties(ctx context.Context, warrantiesService services.WarrantiesService, productAllocationsService services.ProductAllocationsService, shopsList []*shops.Shop, count int) ([]*warranties.Warranty, error) {
	var warrantiesList []*warranties.Warranty

	for i := range shopsList {
		// shop := shopsList[rand.Intn(len(shopsList))]

		// product allocations based on shop id
		productAllocationsFilter, err := productAllocationsService.GetProductsFromProductAllocationsByShopID(ctx, shopsList[i].ID)
		if err != nil {
			return nil, err
		}

		for range count {

			// Random installation date within the last 3 months
			daysAgo := rand.Intn(90)
			installationDate := time.Now().AddDate(0, 0, -daysAgo)

			// Get shop details for branch code
			// shopDetail, err := shopsService.GetShopByID(ctx, shop.ID)
			// if err != nil {
			// 	return nil, err
			// }

			// Format installation date as YYMMDD
			installDateStr := installationDate.Format("060102")

			// Generate warranty number using service
			warrantyNo, err := warrantiesService.GenerateNextWarrantyNo(ctx, shopsList[i].BranchCode, installDateStr)
			if err != nil {
				return nil, err
			}

			refNo := fmt.Sprintf("REF-%05d", rand.Intn(99999))

			clientFirstName := firstNames[rand.Intn(len(firstNames))]
			clientLastName := lastNames[rand.Intn(len(lastNames))]

			createWarrantyParams := &warranties.CreateWarrantyParams{
				ShopID:               shopsList[i].ID,
				ClientName:           fmt.Sprintf("%s %s", clientFirstName, clientLastName),
				ClientContact:        generatePhoneNumber(),
				ClientEmail:          fmt.Sprintf("%s.%s@example.com", clientFirstName, clientLastName),
				CarBrand:             carBrands[rand.Intn(len(carBrands))],
				CarModel:             carModels[rand.Intn(len(carModels))],
				CarColour:            carColors[rand.Intn(len(carColors))],
				CarPlateNo:           generateCarPlateNumber(),
				CarChassisNo:         fmt.Sprintf("CHASSIS-%s-%05d", generateRandomString(5), rand.Intn(99999)),
				InstallationDate:     installationDate,
				ReferenceNo:          &refNo,
				WarrantyNo:           warrantyNo,
				InvoiceAttachmentUrl: fmt.Sprintf("https://example.com/invoices/invoice_%d.pdf", i+1),
			}

			parts := []*warranties.CreateWarrantyPartParams{}
			// 	WarrantyID           int32  `db:"warranty_id" json:"warrantyId"`
			// ProductAllocationID  int32  `db:"product_allocation_id" json:"productAllocationId"`
			// CarPartID            int32  `db:"car_part_id" json:"carPartId"`
			// InstallationImageUrl string `db:"installation_image_url" json:"installationImageUrl"`
			carParts, err := warrantiesService.GetCarParts(ctx)
			if err != nil {
				return nil, err
			}
			// Each warranty has 5 - 7 parts
			numParts := rand.Intn(3) + 5
			usedCarParts := make(map[int32]bool)
			for j := 0; j < numParts; j++ {
				// Select a car part that hasn't been used for this warranty
				var carPart *warranties.CarPart
				for {
					carPart = carParts[rand.Intn(len(carParts))]
					if !usedCarParts[carPart.ID] {
						usedCarParts[carPart.ID] = true
						break
					}
				}
				if len(productAllocationsFilter) == 0 {
					// go to next warranty if no product allocations
					continue
				}
				part := &warranties.CreateWarrantyPartParams{
					ProductAllocationID:  productAllocationsFilter[rand.Intn(len(productAllocationsFilter))].ProductAllocationID,
					CarPartID:            carPart.ID,
					InstallationImageUrl: generateInstallationImageUrl(carPart.Code),
				}
				parts = append(parts, part)
			}

			warranty, err := warrantiesService.CreateWarrantyWithParts(ctx, createWarrantyParams, parts)
			if err != nil {
				return nil, err
			}

			warrantiesList = append(warrantiesList, warranty)
		}
	}

	return warrantiesList, nil
}

func seedClaims(ctx context.Context, svc services.ClaimsService, warrantySvc services.WarrantiesService, warrantiesList []*warranties.Warranty, count int) ([]*claims.Claim, error) {
	var claimsList []*claims.Claim

	for i := 0; i < count; i++ {
		// Select a random warranty
		warranty := warrantiesList[rand.Intn(len(warrantiesList))]

		// Claim date should be after installation date
		claimDate := warranty.InstallationDate.AddDate(0, 0, rand.Intn(60)+7) // 7-67 days after installation

		// Generate simple claim number
		// claimDateStr yymmdd
		claimNo, err := svc.GenerateNextClaimNo(context.Background(), warranty.WarrantyNo, claimDate.Format("060102"))
		if err != nil {
			return nil, err
		}

		claimParams := &claims.CreateClaimParams{
			WarrantyID: warranty.ID,
			ClaimNo:    claimNo,
			ClaimDate:  claimDate,
		}

		// retrieve warranty parts for the warranty
		warrantyParts, err := warrantySvc.GetWarrantyPartsByWarrantyID(ctx, warranty.ID)
		if err != nil {
			return nil, err
		}

		claimWarrantyPartsParms := []*claims.CreateClaimWarrantyPartParams{}
		// Each claim affects 1-3 parts
		numParts := rand.Intn(3) + 1
		if numParts > len(warrantyParts) {
			numParts = len(warrantyParts)
		}

		for j := 0; j < numParts; j++ {
			part := warrantyParts[rand.Intn(len(warrantyParts))]
			remarks := fmt.Sprintf("Damage description for claim %d part %d", i+1, j+1)
			claimWarrantyPartParam := &claims.CreateClaimWarrantyPartParams{
				WarrantyPartID:  part.ID,
				DamagedImageUrl: fmt.Sprintf("https://example.com/damages/claim_%d_part_%d.jpg", i+1, j+1),
				Remarks:         &remarks,
			}
			claimWarrantyPartsParms = append(claimWarrantyPartsParms, claimWarrantyPartParam)
		}
		claim, err := svc.CreateClaimWithParts(ctx, claimParams, claimWarrantyPartsParms)
		if err != nil {
			return nil, err
		}

		claimsList = append(claimsList, claim)
	}
	return claimsList, nil
}

// Helper functions

func generatePhoneNumber() string {
	prefix := phonePrefix[rand.Intn(len(phonePrefix))]
	number := rand.Intn(9000000) + 1000000 // 7 digit number
	return fmt.Sprintf("+60-%s-%d", prefix, number)
}

func generateCarPlateNumber() string {
	states := []string{"A", "B", "C", "D", "V", "W", "P", "R", "T", "K", "M", "N", "J", "H"}
	state := states[rand.Intn(len(states))]
	letters := generateRandomString(2)
	number := rand.Intn(9000) + 1000
	return fmt.Sprintf("%s%s %d", state, letters, number)
}

func generateRandomString(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}

func generateInstallationImageUrl(partCode string) string {
	switch partCode {
	case "FW":
		return spacesUrl + "sample_fw.jpg"
	case "FR":
		return spacesUrl + "sample_fr.jpg"
	case "FL":
		return spacesUrl + "sample_fl.jpg"
	case "RR":
		return spacesUrl + "sample_rr.jpg"
	case "RL":
		return spacesUrl + "sample_rl.jpg"
	case "RW":
		return spacesUrl + "sample_rw.jpg"
	case "SR":
		return spacesUrl + "sample_sr.jpg"
	case "FB":
		return spacesUrl + "sample_fb.jpg"
	case "RB":
		return spacesUrl + "sample_rb.jpg"
	default:
		return spacesUrl + "sample_installation.jpg"
	}
}
