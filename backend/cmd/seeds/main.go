package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/kokweikhong/profilm_ewarranty/backend/internal/config"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/db"
	"github.com/kokweikhong/profilm_ewarranty/backend/internal/seeds"
)

func main() {
	var (
		seedType = flag.String("type", "", "Type of seed data to create (product-brands, product-types, product-series, product-names, warranty-years, states, all)")
		help     = flag.Bool("help", false, "Show help")
	)
	flag.Parse()

	if *help {
		printHelp()
		return
	}

	if *seedType == "" {
		fmt.Println("Error: seed type is required")
		printHelp()
		os.Exit(1)
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	database, err := db.NewDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	ctx := context.Background()

	// Initialize seeder
	seeder := seeds.NewSeeder(database.Pool)

	// Run appropriate seed
	switch *seedType {
	case "product-brands":
		if err := seeder.SeedProductBrands(ctx); err != nil {
			log.Fatal("Failed to seed product brands:", err)
		}
		fmt.Println("✅ Product brands seeded successfully")
	case "product-types":
		if err := seeder.SeedProductTypes(ctx); err != nil {
			log.Fatal("Failed to seed product types:", err)
		}
		fmt.Println("✅ Product types seeded successfully")
	case "product-series":
		if err := seeder.SeedProductSeries(ctx); err != nil {
			log.Fatal("Failed to seed product series:", err)
		}
		fmt.Println("✅ Product series seeded successfully")
	case "product-names":
		if err := seeder.SeedProductNames(ctx); err != nil {
			log.Fatal("Failed to seed product names:", err)
		}
		fmt.Println("✅ Product names seeded successfully")
	case "warranty-years":
		if err := seeder.SeedWarrantyYears(ctx); err != nil {
			log.Fatal("Failed to seed warranty years:", err)
		}
		fmt.Println("✅ Warranty years seeded successfully")
	case "states":
		if err := seeder.SeedStates(ctx); err != nil {
			log.Fatal("Failed to seed states:", err)
		}
		fmt.Println("✅ States seeded successfully")
	case "all":
		if err := seeder.SeedAll(ctx); err != nil {
			log.Fatal("Failed to seed all data:", err)
		}
		fmt.Println("✅ All seed data created successfully")
	default:
		fmt.Printf("Error: unknown seed type '%s'\n", *seedType)
		printHelp()
		os.Exit(1)
	}
}

func printHelp() {
	fmt.Println("Seeds - Database seeding tool")
	fmt.Println()
	fmt.Println("Usage:")
	fmt.Println("  seeds -type <seed-type>")
	fmt.Println()
	fmt.Println("Available seed types:")
	fmt.Println("  product-brands    Seed product brands (Profilm, etc.)")
	fmt.Println("  product-types     Seed product types (Window Tinting Film, Paint Protection Film)")
	fmt.Println("  product-series    Seed product series under product types")
	fmt.Println("                    (Tint Value/Skincare/Premium/Flagship for Window Tinting Film)")
	fmt.Println("                    (Protection Clear/ProColor/Flagship for Paint Protection Film)")
	fmt.Println("  product-names     Seed product names under product series")
	fmt.Println("                    (ICE/LUX/Q70/S76 for Value, UM for Skincare, Y/S/V for Premium, etc.)")
	fmt.Println("  warranty-years    Seed warranty years (5, 7, 10, 12)")
	fmt.Println("  states            Seed Malaysian states (Johor, Selangor, KL, etc.)")
	fmt.Println("  all              Seed all data types")
	fmt.Println()
	fmt.Println("Dependency Order:")
	fmt.Println("  1. product-brands  (Must run first)")
	fmt.Println("  2. product-types   (Requires product-brands)")
	fmt.Println("  3. product-series  (Requires product-types)")
	fmt.Println("  4. product-names   (Requires product-series)")
	fmt.Println("  5. warranty-years  (Independent)")
	fmt.Println("  6. states         (Independent)")
	fmt.Println()
	fmt.Println("Options:")
	fmt.Println("  -help            Show this help message")
	fmt.Println()
	fmt.Println("Examples:")
	fmt.Println("  seeds -type product-brands")
	fmt.Println("  seeds -type product-types")
	fmt.Println("  seeds -type all")
}
