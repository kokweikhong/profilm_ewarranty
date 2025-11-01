package seeds

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/products"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db/sqlc/shops"
)

// Seeder handles database seeding operations
type Seeder struct {
	db             *pgxpool.Pool
	productQueries *products.Queries
	shopQueries    *shops.Queries
}

// NewSeeder creates a new Seeder instance
func NewSeeder(db *pgxpool.Pool) *Seeder {
	return &Seeder{
		db:             db,
		productQueries: products.New(db),
		shopQueries:    shops.New(db),
	}
}

// SeedProductBrands seeds product brands data
func (s *Seeder) SeedProductBrands(ctx context.Context) error {
	fmt.Println("🌱 Seeding product brands...")

	brands := []struct {
		name string
	}{
		{"Profilm"},
		// Add more brands here as needed
	}

	// Get existing brands to check for duplicates
	existingBrands, err := s.productQueries.ListProductBrands(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing product brands: %w", err)
	}

	// Create a map for quick lookup
	existingNames := make(map[string]bool)
	for _, brand := range existingBrands {
		existingNames[brand.Name] = true
	}

	for _, brand := range brands {
		// Check if brand already exists
		if existingNames[brand.name] {
			fmt.Printf("  ⏭️  Product brand '%s' already exists, skipping\n", brand.name)
			continue
		}

		// Create the brand
		createdBrand, err := s.productQueries.CreateProductBrand(ctx, brand.name)
		if err != nil {
			return fmt.Errorf("failed to create product brand '%s': %w", brand.name, err)
		}

		fmt.Printf("  ✅ Created product brand: %s (ID: %s)\n", createdBrand.Name, createdBrand.ID.String())
	}

	return nil
}

// SeedProductTypes seeds product types data
func (s *Seeder) SeedProductTypes(ctx context.Context) error {
	fmt.Println("🌱 Seeding product types...")

	// Get existing brands to find Profilm brand ID
	existingBrands, err := s.productQueries.ListProductBrands(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing product brands: %w", err)
	}

	// Find Profilm brand ID
	var profilmBrandID *string
	for _, brand := range existingBrands {
		if brand.Name == "Profilm" {
			brandIDStr := brand.ID.String()
			profilmBrandID = &brandIDStr
			break
		}
	}

	if profilmBrandID == nil {
		return fmt.Errorf("profilm brand not found, please run product-brands seed first")
	}

	// Parse the brand ID back to UUID for use in parameters
	brandUUID, err := uuid.Parse(*profilmBrandID)
	if err != nil {
		return fmt.Errorf("failed to parse Profilm brand ID: %w", err)
	}

	productTypes := []struct {
		name string
	}{
		{"Window Tinting Film"},
		{"Paint Protection Film"},
		// Add more product types here as needed
	}

	// Get existing product types to check for duplicates
	existingTypes, err := s.productQueries.ListProductTypes(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing product types: %w", err)
	}

	// Create a map for quick lookup (name + brand combination)
	existingTypeKeys := make(map[string]bool)
	for _, pType := range existingTypes {
		key := fmt.Sprintf("%s_%s", pType.BrandID.String(), pType.Name)
		existingTypeKeys[key] = true
	}

	for _, productType := range productTypes {
		// Check if product type already exists for this brand
		key := fmt.Sprintf("%s_%s", brandUUID.String(), productType.name)
		if existingTypeKeys[key] {
			fmt.Printf("  ⏭️  Product type '%s' already exists for Profilm brand, skipping\n", productType.name)
			continue
		}

		// Create the product type
		createdType, err := s.productQueries.CreateProductType(ctx, &products.CreateProductTypeParams{
			BrandID: brandUUID,
			Name:    productType.name,
		})
		if err != nil {
			return fmt.Errorf("failed to create product type '%s': %w", productType.name, err)
		}

		fmt.Printf("  ✅ Created product type: %s (ID: %s) under Profilm brand\n", createdType.Name, createdType.ID.String())
	}

	return nil
}

// SeedProductSeries seeds product series data
func (s *Seeder) SeedProductSeries(ctx context.Context) error {
	fmt.Println("🌱 Seeding product series...")

	// Get existing product types to find Window Tinting Film and Paint Protection Film IDs
	existingTypes, err := s.productQueries.ListProductTypes(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing product types: %w", err)
	}

	// Find product type IDs
	var windowTintingFilmTypeID, paintProtectionFilmTypeID *uuid.UUID
	for _, pType := range existingTypes {
		switch pType.Name {
		case "Window Tinting Film":
			windowTintingFilmTypeID = &pType.ID
		case "Paint Protection Film":
			paintProtectionFilmTypeID = &pType.ID
		}
	}

	if windowTintingFilmTypeID == nil {
		return fmt.Errorf("window Tinting Film product type not found, please run product-types seed first")
	}

	if paintProtectionFilmTypeID == nil {
		return fmt.Errorf("paint Protection Film product type not found, please run product-types seed first")
	}

	// Define product series data
	productSeries := []struct {
		productTypeID uuid.UUID
		name          string
		typeName      string // For logging purposes
	}{
		// Window Tinting Film series
		{*windowTintingFilmTypeID, "Tint Value Series", "Window Tinting Film"},
		{*windowTintingFilmTypeID, "Tint Skincare Series", "Window Tinting Film"},
		{*windowTintingFilmTypeID, "Tint Premium Series", "Window Tinting Film"},
		{*windowTintingFilmTypeID, "Tint Flagship Series", "Window Tinting Film"},

		// Paint Protection Film series
		{*paintProtectionFilmTypeID, "Protection Clear Series", "Paint Protection Film"},
		{*paintProtectionFilmTypeID, "Protection ProColor Series", "Paint Protection Film"},
		{*paintProtectionFilmTypeID, "Protection Flagship Series", "Paint Protection Film"},
	}

	// Get existing product series to check for duplicates
	existingSeries, err := s.productQueries.ListProductSeries(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing product series: %w", err)
	}

	// Create a map for quick lookup (name + product_type_id combination)
	existingSeriesKeys := make(map[string]bool)
	for _, series := range existingSeries {
		key := fmt.Sprintf("%s_%s", series.ProductTypeID.String(), series.Name)
		existingSeriesKeys[key] = true
	}

	for _, series := range productSeries {
		// Check if product series already exists for this product type
		key := fmt.Sprintf("%s_%s", series.productTypeID.String(), series.name)
		if existingSeriesKeys[key] {
			fmt.Printf("  ⏭️  Product series '%s' already exists for %s, skipping\n", series.name, series.typeName)
			continue
		}

		// Create the product series
		createdSeries, err := s.productQueries.CreateProductSeries(ctx, &products.CreateProductSeriesParams{
			ProductTypeID: series.productTypeID,
			Name:          series.name,
		})
		if err != nil {
			return fmt.Errorf("failed to create product series '%s': %w", series.name, err)
		}

		fmt.Printf("  ✅ Created product series: %s (ID: %s) under %s\n", createdSeries.Name, createdSeries.ID.String(), series.typeName)
	}

	return nil
}

// SeedProductNames seeds product names data
func (s *Seeder) SeedProductNames(ctx context.Context) error {
	fmt.Println("🌱 Seeding product names...")

	// Get existing product series to find series IDs
	existingSeries, err := s.productQueries.ListProductSeries(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing product series: %w", err)
	}

	// Create a map for quick lookup by series name
	seriesMap := make(map[string]uuid.UUID)
	for _, series := range existingSeries {
		seriesMap[series.Name] = series.ID
	}

	// Define product names data with comprehensive catalog
	productNames := []struct {
		seriesName string
		names      []string
	}{
		// Window Tinting Film - Tint Value Series
		{
			"Tint Value Series",
			[]string{"ICE80", "ICE50", "ICE35", "ICE15", "ICE5", "LUX50", "LUX35", "LUX15", "LUX5", "Q70", "S76"},
		},
		// Window Tinting Film - Tint Skincare Series
		{
			"Tint Skincare Series",
			[]string{"UM70", "UM30", "UM18"},
		},
		// Window Tinting Film - Tint Premium Series
		{
			"Tint Premium Series",
			[]string{"Y70", "S35", "S20", "V35", "V20"},
		},
		// Window Tinting Film - Tint Flagship Series
		{
			"Tint Flagship Series",
			[]string{"K70"},
		},
		// Paint Protection Film - Protection Clear Series
		{
			"Protection Clear Series",
			[]string{"Hydro Protect", "P10", "reGen", "Ultra Clear Pro"},
		},
		// Paint Protection Film - Protection ProColor Series
		{
			"Protection ProColor Series",
			[]string{"Blue Diamond", "Gold Diamond", "Gold Shine", "Green Chameleon", "Moon Shine", "Red Diamond", "Rose Chameleon", "Silver Diamond"},
		},
		// Paint Protection Film - Protection Flagship Series
		{
			"Protection Flagship Series",
			[]string{"Ultra Clear Pro X"},
		},
	}

	// Verify all required series exist
	for _, seriesData := range productNames {
		if _, exists := seriesMap[seriesData.seriesName]; !exists {
			return fmt.Errorf("product series '%s' not found, please run product-series seed first", seriesData.seriesName)
		}
	}

	// Get existing product names to check for duplicates
	existingNames, err := s.productQueries.ListProductNames(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing product names: %w", err)
	}

	// Create a map for quick lookup (name + series_id combination)
	existingNameKeys := make(map[string]bool)
	for _, name := range existingNames {
		key := fmt.Sprintf("%s_%s", name.ProductSeriesID.String(), name.Name)
		existingNameKeys[key] = true
	}

	// Create product names
	for _, seriesData := range productNames {
		seriesID := seriesMap[seriesData.seriesName]

		for _, productName := range seriesData.names {
			// Check if product name already exists for this series
			key := fmt.Sprintf("%s_%s", seriesID.String(), productName)
			if existingNameKeys[key] {
				fmt.Printf("  ⏭️  Product name '%s' already exists for %s, skipping\n", productName, seriesData.seriesName)
				continue
			}

			// Create the product name
			createdName, err := s.productQueries.CreateProductName(ctx, &products.CreateProductNameParams{
				ProductSeriesID: seriesID,
				Name:            productName,
			})
			if err != nil {
				return fmt.Errorf("failed to create product name '%s': %w", productName, err)
			}

			fmt.Printf("  ✅ Created product name: %s (ID: %s) under %s\n", createdName.Name, createdName.ID.String(), seriesData.seriesName)
		}
	}

	return nil
}

// SeedWarrantyYears seeds warranty years data
func (s *Seeder) SeedWarrantyYears(ctx context.Context) error {
	fmt.Println("🌱 Seeding warranty years...")

	warrantyYears := []int32{5, 7, 10, 12}

	// Get existing warranty years to check for duplicates
	existingYears, err := s.productQueries.ListWarrantyYears(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing warranty years: %w", err)
	}

	// Create a map for quick lookup
	existingYearsMap := make(map[int32]bool)
	for _, year := range existingYears {
		existingYearsMap[year.Years] = true
	}

	for _, year := range warrantyYears {
		// Check if warranty year already exists
		if existingYearsMap[year] {
			fmt.Printf("  ⏭️  Warranty year '%d' already exists, skipping\n", year)
			continue
		}

		// Create the warranty year
		createdYear, err := s.productQueries.CreateWarrantyYear(ctx, year)
		if err != nil {
			return fmt.Errorf("failed to create warranty year '%d': %w", year, err)
		}

		fmt.Printf("  ✅ Created warranty year: %d years (ID: %s)\n", createdYear.Years, createdYear.ID.String())
	}

	return nil
}

// SeedStates seeds Malaysian states data
func (s *Seeder) SeedStates(ctx context.Context) error {
	fmt.Println("🌱 Seeding Malaysian states...")

	states := []string{
		"Johor",
		"Kedah",
		"Kelantan",
		"Malacca (Melaka)",
		"Negeri Sembilan",
		"Pahang",
		"Penang (Pulau Pinang)",
		"Perak",
		"Perlis",
		"Sabah",
		"Sarawak",
		"Selangor",
		"Terengganu",
		"Kuala Lumpur",
		"Labuan",
		"Putrajaya",
	}

	// Get existing states to check for duplicates
	existingStates, err := s.shopQueries.ListStates(ctx)
	if err != nil {
		return fmt.Errorf("failed to list existing states: %w", err)
	}

	// Create a map for quick lookup
	existingStatesMap := make(map[string]bool)
	for _, state := range existingStates {
		existingStatesMap[state.Name] = true
	}

	for _, stateName := range states {
		// Check if state already exists
		if existingStatesMap[stateName] {
			fmt.Printf("  ⏭️  State '%s' already exists, skipping\n", stateName)
			continue
		}

		// Create the state
		createdState, err := s.shopQueries.CreateState(ctx, stateName)
		if err != nil {
			return fmt.Errorf("failed to create state '%s': %w", stateName, err)
		}

		fmt.Printf("  ✅ Created state: %s (ID: %s)\n", createdState.Name, createdState.ID.String())
	}

	return nil
}

// SeedAll seeds all available data types
func (s *Seeder) SeedAll(ctx context.Context) error {
	fmt.Println("🌱 Seeding all data...")

	// Seed product brands first (they're dependencies for other data)
	if err := s.SeedProductBrands(ctx); err != nil {
		return fmt.Errorf("failed to seed product brands: %w", err)
	}

	// Seed product types (depends on brands)
	if err := s.SeedProductTypes(ctx); err != nil {
		return fmt.Errorf("failed to seed product types: %w", err)
	}

	// Seed product series (depends on product types)
	if err := s.SeedProductSeries(ctx); err != nil {
		return fmt.Errorf("failed to seed product series: %w", err)
	}

	// Seed product names (depends on product series)
	if err := s.SeedProductNames(ctx); err != nil {
		return fmt.Errorf("failed to seed product names: %w", err)
	}

	// Seed warranty years (independent)
	if err := s.SeedWarrantyYears(ctx); err != nil {
		return fmt.Errorf("failed to seed warranty years: %w", err)
	}

	// Seed states (independent)
	if err := s.SeedStates(ctx); err != nil {
		return fmt.Errorf("failed to seed states: %w", err)
	}

	return nil
}
